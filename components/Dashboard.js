"use client";

import { useEffect, useState } from "react";
import { syllabus } from "@/data/syllabus9";

const STATUS_COLORS = {
  todo: "bg-zinc-700",
  doing: "bg-yellow-500",
  done: "bg-green-600",
  mastered: "bg-purple-600",
};

const STATUS_ORDER = ["todo", "doing", "done", "mastered"];

export default function Dashboard({ selectedClass }) {
  const [data, setData] = useState({});
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("progress-9th");
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("progress-9th", JSON.stringify(data));
  }, [data]);

  const updateLesson = (subject, lesson, updates) => {
    setData((prev) => ({
      ...prev,
      [subject]: {
        ...(prev[subject] || {}),
        [lesson]: {
          status: "todo",
          revisions: 0,
          pyqs: 0,
          video: "",
          pyqLink: "",
          ...(prev[subject]?.[lesson] || {}),
          ...updates,
        },
      },
    }));
  };

  const allLessons = Object.values(data).flatMap((s) => Object.values(s));
  const completed = allLessons.filter(
    (l) => l.status === "done" || l.status === "mastered"
  ).length;
  const total = Object.values(syllabus)
    .flatMap((s) =>
      Array.isArray(s) ? s : Object.values(s).flat()
    ).length;

  const percent = total ? Math.round((completed / total) * 100) : 0;

  const toggle = (key) =>
    setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  const renderLesson = (subject, lesson) => {
    const l = data?.[subject]?.[lesson] || {};
    if (!lesson.toLowerCase().includes(search.toLowerCase())) return null;

    return (
      <div
        key={lesson}
        className={`p-3 rounded mb-2 ${STATUS_COLORS[l.status || "todo"]}`}
      >
        <div className="font-semibold mb-2">{lesson}</div>

        <div className="flex gap-2 mb-2">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => updateLesson(subject, lesson, { status: s })}
              className={`px-2 py-1 text-xs rounded ${
                l.status === s ? "ring-2 ring-white" : ""
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-4 text-sm mb-2">
          <label>
            Revisions:
            <input
              type="number"
              min="0"
              max="100"
              value={l.revisions || 0}
              onChange={(e) =>
                updateLesson(subject, lesson, {
                  revisions: Number(e.target.value),
                })
              }
              className="ml-2 w-16 bg-black rounded px-1"
            />
          </label>

          <label>
            PYQs:
            <input
              type="number"
              min="0"
              max="100"
              value={l.pyqs || 0}
              onChange={(e) =>
                updateLesson(subject, lesson, {
                  pyqs: Number(e.target.value),
                })
              }
              className="ml-2 w-16 bg-black rounded px-1"
            />
          </label>
        </div>

        <input
          placeholder="Lesson video link"
          value={l.video || ""}
          onChange={(e) =>
            updateLesson(subject, lesson, { video: e.target.value })
          }
          className="w-full mb-1 bg-black p-1 rounded text-sm"
        />

        <input
          placeholder="PYQs link"
          value={l.pyqLink || ""}
          onChange={(e) =>
            updateLesson(subject, lesson, { pyqLink: e.target.value })
          }
          className="w-full bg-black p-1 rounded text-sm"
        />
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">
          Dashboard – Class {selectedClass}
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("progress-9th");
            location.reload();
          }}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <input
        placeholder="Search lessons..."
        className="w-full mb-4 p-2 rounded bg-zinc-900"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mb-6">
        <div className="flex justify-between text-sm">
          <span>Overall Progress</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-blue-500 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {Object.entries(syllabus).map(([subject, content]) => (
        <div key={subject} className="mb-6">
          <button
            onClick={() => toggle(subject)}
            className="text-2xl font-semibold mb-2"
          >
            {subject} {openSections[subject] ? "▾" : "▸"}
          </button>

          {openSections[subject] &&
            (Array.isArray(content)
              ? content.map((l) => renderLesson(subject, l))
              : Object.entries(content).map(([sub, lessons]) => (
                  <div key={sub} className="ml-4">
                    <button
                      onClick={() => toggle(subject + sub)}
                      className="text-lg mb-1"
                    >
                      {sub} {openSections[subject + sub] ? "▾" : "▸"}
                    </button>
                    {openSections[subject + sub] &&
                      lessons.map((l) => renderLesson(subject, l))}
                  </div>
                )))}
        </div>
      ))}
    </div>
  );
}

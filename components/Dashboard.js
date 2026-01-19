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
  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState("");

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem("progress-9th");
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem("progress-9th", JSON.stringify(progress));
  }, [progress]);

  const setStatus = (subject, lesson, status) => {
    setProgress((prev) => ({
      ...prev,
      [subject]: {
        ...(prev[subject] || {}),
        [lesson]: status,
      },
    }));
  };

  const allLessons = [];
  Object.values(syllabus).forEach((section) => {
    if (Array.isArray(section)) {
      allLessons.push(...section);
    } else {
      Object.values(section).forEach((arr) => allLessons.push(...arr));
    }
  });

  const completedCount = Object.values(progress)
    .flatMap((s) => Object.values(s))
    .filter((v) => v === "done" || v === "mastered").length;

  const totalCount = allLessons.length;
  const percent = Math.round((completedCount / totalCount) * 100) || 0;

  const renderLessons = (subject, lessons) =>
    lessons
      .filter((l) => l.toLowerCase().includes(search.toLowerCase()))
      .map((lesson) => {
        const status = progress?.[subject]?.[lesson] || "todo";

        return (
          <div
            key={lesson}
            className={`rounded-lg p-3 mb-2 text-white ${STATUS_COLORS[status]}`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{lesson}</span>
              <div className="flex gap-2">
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(subject, lesson, s)}
                    className={`px-2 py-1 text-xs rounded ${
                      status === s ? "ring-2 ring-white" : ""
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      });

  return (
    <div className="text-white p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Dashboard – Class {selectedClass}
      </h1>

      {/* Search */}
      <input
        className="w-full mb-6 p-2 rounded bg-zinc-900 outline-none"
        placeholder="Search lessons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
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

      {/* Subjects */}
      {Object.entries(syllabus).map(([subject, content]) => (
        <div key={subject} className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">{subject}</h2>

          {Array.isArray(content)
            ? renderLessons(subject, content)
            : Object.entries(content).map(([sub, lessons]) => (
                <div key={sub} className="ml-4">
                  <h3 className="text-lg mb-2">{sub}</h3>
                  {renderLessons(subject, lessons)}
                </div>
              ))}
        </div>
      ))}
    </div>
  );
}

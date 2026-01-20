"use client";

import { useEffect, useMemo, useState } from "react";
import { syllabus } from "../data/syllabus";

const CLASSES = ["9th", "10th", "11th", "12th", "JEE / NEET"];
const STATUSES = ["todo", "doing", "done", "mastered"];

export default function Dashboard() {
  const [selectedClass, setSelectedClass] = useState("9th");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState({});
  const [data, setData] = useState({});

  /* -------------------- LOAD / SAVE -------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("progress");
    if (saved) setData(JSON.parse(saved));
  }, []);

  const saveProgress = () => {
    localStorage.setItem("progress", JSON.stringify(data));
    alert("Progress saved ✅");
  };

  const resetProgress = () => {
    if (!confirm("Reset all progress?")) return;
    setData({});
    localStorage.removeItem("progress");
  };

  /* -------------------- HELPERS -------------------- */
  const toggle = (key) =>
    setOpen((p) => ({ ...p, [key]: !p[key] }));

  const lessonKey = (name) => `lesson::${name}`;

  const updateLesson = (lesson, patch) => {
    setData((prev) => ({
      ...prev,
      [lesson]: {
        status: "todo",
        revisions: 0,
        pyqs: 0,
        ...prev[lesson],
        ...patch,
      },
    }));
  };

  /* -------------------- PROGRESS -------------------- */
  const allLessons = useMemo(() => {
    const collect = [];
    Object.values(syllabus).forEach((s) => {
      if (Array.isArray(s)) collect.push(...s);
      else Object.values(s).forEach((x) => collect.push(...x));
    });
    return collect;
  }, []);

  const progressPercent = useMemo(() => {
    if (!allLessons.length) return 0;
    const done = allLessons.filter(
      (l) => data[l]?.status === "done" || data[l]?.status === "mastered"
    ).length;
    return Math.round((done / allLessons.length) * 100);
  }, [data, allLessons]);

  /* -------------------- RENDER LESSON -------------------- */
  const renderLesson = (lesson) => {
    if (
      search &&
      !lesson.toLowerCase().includes(search.toLowerCase())
    )
      return null;

    const l = data[lesson] || { status: "todo", revisions: 0, pyqs: 0 };
    const key = lessonKey(lesson);

    return (
      <div key={lesson} className="ml-6 mt-3 rounded-xl bg-zinc-900 p-4">
        <button
          onClick={() => toggle(key)}
          className="flex items-center gap-2 font-medium"
        >
          <span>{open[key] ? "▼" : "▶"}</span>
          {lesson}
        </button>

        {open[key] && (
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateLesson(lesson, { status: s })}
                  className={`px-3 py-1 rounded ${
                    l.status === s ? "bg-blue-600" : "bg-zinc-800"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex gap-6">
              <button
                onClick={() =>
                  updateLesson(lesson, {
                    revisions: Math.max(0, l.revisions - 1),
                  })
                }
              >
                −
              </button>
              <span>Revisions: {l.revisions}</span>
              <button
                onClick={() =>
                  updateLesson(lesson, { revisions: l.revisions + 1 })
                }
              >
                +
              </button>
            </div>

            <div className="flex gap-6">
              <button
                onClick={() =>
                  updateLesson(lesson, {
                    pyqs: Math.max(0, l.pyqs - 1),
                  })
                }
              >
                −
              </button>
              <span>PYQs: {l.pyqs}</span>
              <button
                onClick={() =>
                  updateLesson(lesson, { pyqs: l.pyqs + 1 })
                }
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* -------------------- RENDER SUBJECT -------------------- */
  const renderSubject = (name, content) => {
    const key = `subject::${name}`;

    return (
      <div key={name} className="rounded-2xl bg-zinc-900 p-5">
        <button
          onClick={() => toggle(key)}
          className="flex w-full justify-between text-lg font-semibold"
        >
          {name}
          <span>{open[key] ? "▼" : "▶"}</span>
        </button>

        {open[key] && (
          <div className="mt-4">
            {Array.isArray(content) &&
              content.map(renderLesson)}

            {!Array.isArray(content) &&
              Object.entries(content).map(([sub, lessons]) => {
                const subKey = `${key}::${sub}`;
                return (
                  <div key={sub} className="ml-4 mt-4">
                    <button
                      onClick={() => toggle(subKey)}
                      className="flex gap-2 font-medium"
                    >
                      <span>{open[subKey] ? "▼" : "▶"}</span>
                      {sub}
                    </button>
                    {open[subKey] &&
                      lessons.map(renderLesson)}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  /* -------------------- UI -------------------- */
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Dashboard – Class {selectedClass}
        </h1>
        <button className="text-red-500">Logout</button>
      </div>

      {/* CLASS SELECTOR */}
      <div className="flex gap-2 flex-wrap">
        {CLASSES.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedClass(c)}
            className={`px-4 py-1 rounded ${
              selectedClass === c
                ? "bg-blue-600"
                : "bg-zinc-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* PROGRESS BAR */}
      <div>
        <div className="mb-1 text-sm">
          Overall Progress — {progressPercent}%
        </div>
        <div className="h-3 rounded bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={saveProgress} className="bg-green-600 px-4 py-2 rounded">
          Save
        </button>
        <button onClick={resetProgress} className="bg-zinc-700 px-4 py-2 rounded">
          Reset
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search lessons..."
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none"
      />

      {Object.entries(syllabus).map(([n, c]) =>
        renderSubject(n, c)
      )}
    </main>
  );
}

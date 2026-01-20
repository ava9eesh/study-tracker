"use client";

import { useState } from "react";
import { syllabus } from "../data/syllabus";

export default function Dashboard({ user }) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState({});
  const [lessonOpen, setLessonOpen] = useState({});
  const [progress, setProgress] = useState({});

  const toggle = (key) =>
    setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const toggleLesson = (key) =>
    setLessonOpen((p) => ({ ...p, [key]: !p[key] }));

  const setStatus = (lesson, status) =>
    setProgress((p) => ({
      ...p,
      [lesson]: { ...p[lesson], status },
    }));

  const inc = (lesson, field) =>
    setProgress((p) => ({
      ...p,
      [lesson]: {
        ...p[lesson],
        [field]: (p[lesson]?.[field] || 0) + 1,
      },
    }));

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Welcome, {user?.displayName || "Student"}
        </h1>
        <button className="text-red-400 text-sm">Logout</button>
      </div>

      {/* Search */}
      <input
        placeholder="Search lessons..."
        className="w-full mb-6 p-3 rounded-lg bg-zinc-900 border border-zinc-800 outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Subjects */}
      {Object.entries(syllabus).map(([subject, data]) => (
        <div key={subject} className="mb-4 glass rounded-xl">
          {/* Subject Header */}
          <button
            onClick={() => toggle(subject)}
            className="w-full text-left px-5 py-4 font-medium flex justify-between"
          >
            {subject}
            <span>{collapsed[subject] ? "▾" : "▸"}</span>
          </button>

          {/* Lessons */}
          {collapsed[subject] && (
            <div className="px-6 pb-4 space-y-3">
              {Array.isArray(data)
                ? data
                    .filter((l) =>
                      l.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((lesson) => renderLesson())
                : Object.entries(data).map(([sub, lessons]) => (
                    <div key={sub}>
                      <h3 className="text-sm text-gray-400 mb-2">{sub}</h3>
                      {lessons
                        .filter((l) =>
                          l.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((lesson) => renderLesson())}
                    </div>
                  ))}
            </div>
          )}
        </div>
      ))}
    </main>
  );

  function renderLesson() {
    const lesson = arguments[0];
    const data = progress[lesson] || {};
    const open = lessonOpen[lesson];

    return (
      <div key={lesson} className="border border-zinc-800 rounded-lg">
        <button
          onClick={() => toggleLesson(lesson)}
          className="w-full px-4 py-3 text-left flex justify-between"
        >
          {lesson}
          <span>{open ? "−" : "+"}</span>
        </button>

        {open && (
          <div className="px-4 pb-4 space-y-3 text-sm">
            {/* Status */}
            <div className="flex gap-2">
              {["todo", "doing", "done", "mastered"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(lesson, s)}
                  className={`px-3 py-1 rounded text-xs border
                    ${
                      data.status === s
                        ? s === "doing"
                          ? "bg-yellow-500/20 border-yellow-500"
                          : s === "done"
                          ? "bg-green-500/20 border-green-500"
                          : s === "mastered"
                          ? "bg-purple-500/20 border-purple-500"
                          : ""
                        : "border-zinc-700"
                    }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Counters */}
            <div className="flex gap-6">
              <div>
                Revisions: {data.revisions || 0}{" "}
                <button onClick={() => inc(lesson, "revisions")}>+</button>
              </div>
              <div>
                PYQs: {data.pyqs || 0}{" "}
                <button onClick={() => inc(lesson, "pyqs")}>+</button>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-4 text-blue-400 text-xs">
              <a href="#" target="_blank">Lesson Video</a>
              <a href="#" target="_blank">PYQs</a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

"use client";

import { useState } from "react";
import { syllabus } from "../data/syllabus";

const STATUS_STYLES = {
  todo: "bg-gray-700 text-gray-200",
  doing: "bg-yellow-400 text-black",
  done: "bg-green-600 text-white",
  mastered: "bg-purple-600 text-white",
};

export default function Dashboard({ logout }) {
  const [progress, setProgress] = useState({});
  const [open, setOpen] = useState({});
  const [search, setSearch] = useState("");

  const setStatus = (lesson, status) => {
    setProgress((prev) => ({
      ...prev,
      [lesson]: {
        ...(prev[lesson] || {}),
        status,
      },
    }));
  };

  /* -------- PROGRESS BAR LOGIC -------- */
  const allLessons = Object.values(syllabus)
    .flat()
    .map((l) => l.name);

  const completedCount = allLessons.filter((l) => {
    const s = progress[l]?.status;
    return s === "done" || s === "mastered";
  }).length;

  const progressPercent = allLessons.length
    ? Math.round((completedCount / allLessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Class 9 Dashboard</h1>

        <button
          onClick={() => logout && logout()}
          className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-sm"
        >
          Logout
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1 opacity-80">
          <span>Overall Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-green-500 rounded transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search lessons..."
        className="w-full mb-6 p-2 rounded bg-zinc-900 outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* SUBJECTS */}
      {Object.entries(syllabus).map(([subject, lessons]) => (
        <div key={subject} className="mb-8">
          {/* SUBJECT HEADER */}
          <button
            onClick={() => setOpen({ ...open, [subject]: !open[subject] })}
            className="text-xl font-medium mb-3 flex items-center gap-2"
          >
            {subject}
            <span className="text-sm opacity-60">
              {open[subject] ? "▾" : "▸"}
            </span>
          </button>

          {/* LESSONS */}
          {open[subject] &&
            lessons
              .filter((l) =>
                l.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((lesson) => {
                const current = progress[lesson.name]?.status || "todo";

                return (
                  <div
                    key={lesson.name}
                    className="bg-zinc-900 p-4 rounded-lg mb-3 border border-zinc-800"
                  >
                    <div className="font-medium mb-3">
                      {lesson.name}
                    </div>

                    {/* STATUS BUTTONS */}
                    <div className="flex gap-2 mb-3">
                      {["todo", "doing", "done", "mastered"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(lesson.name, s)}
                          className={`px-3 py-1 rounded text-sm border transition
                            ${
                              current === s
                                ? STATUS_STYLES[s]
                                : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                            }
                          `}
                        >
                          {s.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    {/* LINKS */}
                    <div className="flex gap-4 text-sm">
                      {lesson.video && (
                        <a
                          href={lesson.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Lesson Video
                        </a>
                      )}

                      {lesson.pyq ? (
                        <a
                          href={lesson.pyq}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:underline"
                        >
                          PYQs
                        </a>
                      ) : (
                        <span className="text-purple-400 opacity-40 cursor-not-allowed">
                          PYQs
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
        </div>
      ))}
    </div>
  );
}

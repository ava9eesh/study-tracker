"use client";

import { useState } from "react";
import { syllabus } from "../data/syllabus";

const STATUS_STYLES = {
  todo: "border-gray-500 text-gray-300 bg-gray-700",
  doing: "border-yellow-500 text-black bg-yellow-400",
  done: "border-green-500 text-white bg-green-600",
  mastered: "border-purple-500 text-white bg-purple-600",
};

export default function Dashboard() {
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

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Class 9 Dashboard</h1>

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
                    <div className="flex gap-2">
                      {["todo", "doing", "done", "mastered"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(lesson.name, s)}
                          className={`px-3 py-1 rounded border text-sm transition
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
                    <div className="flex gap-4 mt-3 text-sm">
                      {lesson.video && (
                        <a
                          href={lesson.video}
                          target="_blank"
                          className="text-blue-400 hover:underline"
                        >
                          Lesson Video
                        </a>
                      )}
                      <span className="text-purple-400 opacity-50">
                        PYQs
                      </span>
                    </div>
                  </div>
                );
              })}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { loadUserData, saveUserData } from "@/utils/firestore";
import { syllabus } from "@/data/syllabus";

const STATUS_COLORS = {
  todo: "",
  doing: "bg-yellow-500 text-black",
  done: "bg-green-600",
  mastered: "bg-purple-600",
};

export default function Dashboard({ user }) {
  const uid = user.uid;

  const [data, setData] = useState({});
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState({});

  // 🔹 Load data from Firestore
  useEffect(() => {
    async function load() {
      const userData = await loadUserData(uid);
      if (userData?.progress) {
        setData(userData.progress);
      }
    }
    load();
  }, [uid]);

  // 🔹 Save helper
  const updateLesson = async (lesson, updates) => {
    const newData = {
      ...data,
      [lesson]: {
        status: "todo",
        revisions: 0,
        pyqs: 0,
        ...data[lesson],
        ...updates,
      },
    };
    setData(newData);
    await saveUserData(uid, { progress: newData });
  };

  // 🔹 Progress %
  const lessons = Object.values(syllabus).flat();
  const completed = Object.values(data).filter(
    (l) => l.status === "done" || l.status === "mastered"
  ).length;
  const percent = Math.round((completed / lessons.length) * 100);

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard — Class 9th
      </h1>

      {/* Search */}
      <input
        className="w-full mb-6 p-2 rounded bg-zinc-800"
        placeholder="Search lessons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Progress bar */}
      <div className="mb-8">
        <div className="text-sm mb-1">Overall Progress — {percent}%</div>
        <div className="w-full h-2 bg-zinc-700 rounded">
          <div
            className="h-2 bg-blue-500 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Subjects */}
      {Object.entries(syllabus).map(([subject, lessons]) => (
        <div key={subject} className="mb-6">
          <button
            onClick={() =>
              setCollapsed((c) => ({ ...c, [subject]: !c[subject] }))
            }
            className="w-full text-left font-semibold text-lg mb-2"
          >
            {subject}
          </button>

          {!collapsed[subject] &&
            lessons
              .filter((l) =>
                l.toLowerCase().includes(search.toLowerCase())
              )
              .map((lesson) => {
                const l = data[lesson] || {
                  status: "todo",
                  revisions: 0,
                  pyqs: 0,
                };

                return (
                  <div
                    key={lesson}
                    className="bg-zinc-900 p-4 rounded mb-3"
                  >
                    <div className="font-medium mb-3">{lesson}</div>

                    {/* Status buttons */}
                    <div className="flex gap-2 mb-3">
                      {["todo", "doing", "done", "mastered"].map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            updateLesson(lesson, { status: s })
                          }
                          className={`px-3 py-1 rounded border border-zinc-700 ${
                            l.status === s ? STATUS_COLORS[s] : ""
                          }`}
                        >
                          {s.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    {/* Revisions + PYQs */}
                    <div className="flex gap-6 text-sm mb-2">
                      <div>
                        Revisions:
                        <button
                          className="mx-2"
                          onClick={() =>
                            updateLesson(lesson, {
                              revisions: Math.max(0, l.revisions - 1),
                            })
                          }
                        >
                          −
                        </button>
                        {l.revisions}
                        <button
                          className="mx-2"
                          onClick={() =>
                            updateLesson(lesson, {
                              revisions: l.revisions + 1,
                            })
                          }
                        >
                          +
                        </button>
                      </div>

                      <div>
                        PYQs:
                        <button
                          className="mx-2"
                          onClick={() =>
                            updateLesson(lesson, {
                              pyqs: Math.max(0, l.pyqs - 1),
                            })
                          }
                        >
                          −
                        </button>
                        {l.pyqs}
                        <button
                          className="mx-2"
                          onClick={() =>
                            updateLesson(lesson, { pyqs: l.pyqs + 1 })
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="text-sm text-blue-400 flex gap-4">
                      <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Lesson Video
                      </a>
                      <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                      >
                        PYQs
                      </a>
                    </div>
                  </div>
                );
              })}
        </div>
      ))}
    </div>
  );
}

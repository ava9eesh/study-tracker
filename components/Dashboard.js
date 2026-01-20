"use client";

import { useState } from "react";
import { syllabus } from "../data/syllabus";

const STATUS_WEIGHT = {
  todo: 0,
  doing: 0.5,
  done: 1,
  mastered: 1,
};

export default function Dashboard() {
  const [open, setOpen] = useState({});
  const [lessonData, setLessonData] = useState({});
  const [search, setSearch] = useState("");

  const toggle = (key) =>
    setOpen((p) => ({ ...p, [key]: !p[key] }));

  const updateLesson = (lesson, patch) => {
    setLessonData((p) => ({
      ...p,
      [lesson]: {
        status: "todo",
        revisions: 0,
        pyqs: 0,
        ...p[lesson],
        ...patch,
      },
    }));
  };

  /* ---------------- PROGRESS ---------------- */
  const allLessons = [];
  Object.values(syllabus).forEach((subject) => {
    if (Array.isArray(subject)) {
      allLessons.push(...subject);
    } else {
      Object.values(subject).forEach((arr) => {
        allLessons.push(...arr);
      });
    }
  });

  const progress =
    allLessons.length === 0
      ? 0
      : Math.round(
          (allLessons.reduce((sum, l) => {
            const s = lessonData[l]?.status || "todo";
            return sum + STATUS_WEIGHT[s];
          }, 0) /
            allLessons.length) *
            100
        );

  /* ---------------- RENDER HELPERS ---------------- */
  const Lesson = (lesson) => {
    if (
      search &&
      !lesson.toLowerCase().includes(search.toLowerCase())
    )
      return null;

    const data = lessonData[lesson] || {
      status: "todo",
      revisions: 0,
      pyqs: 0,
    };

    const key = `lesson-${lesson}`;

    return (
      <div key={lesson} className="ml-6 mt-3 rounded-xl bg-zinc-900 p-4">
        <button
          onClick={() => toggle(key)}
          className="w-full text-left font-medium"
        >
          ▶ {lesson}
        </button>

        {open[key] && (
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex gap-2 flex-wrap">
              {["todo", "doing", "done", "mastered"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateLesson(lesson, { status: s })}
                  className={`px-3 py-1 rounded ${
                    data.status === s
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-zinc-800"
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
                    revisions: data.revisions + 1,
                  })
                }
                className="text-green-400"
              >
                Revisions: {data.revisions} +
              </button>

              <button
                onClick={() =>
                  updateLesson(lesson, {
                    pyqs: data.pyqs + 1,
                  })
                }
                className="text-pink-400"
              >
                PYQs: {data.pyqs} +
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Subject = (name, data) => {
    const key = `subject-${name}`;

    return (
      <div key={name} className="rounded-2xl bg-zinc-900 p-5">
        <button
          onClick={() => toggle(key)}
          className="w-full text-left text-lg font-semibold"
        >
          ▼ {name}
        </button>

        {open[key] && (
          <div className="mt-4">
            {Array.isArray(data) &&
              data.map((l) => Lesson(l))}

            {!Array.isArray(data) &&
              Object.entries(data).map(([sub, lessons]) => (
                <div key={sub} className="ml-4 mt-4">
                  <div className="font-medium text-gray-300">
                    ▸ {sub}
                  </div>
                  {lessons.map((l) => Lesson(l))}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Dashboard – Class 9th
        </h1>
        <button className="text-red-500">Logout</button>
      </div>

      {/* PROGRESS */}
      <div>
        <div className="text-sm mb-1">
          Overall Progress — {progress}%
        </div>
        <div className="h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-green-500 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search lessons..."
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none"
      />

      {Object.entries(syllabus).map(([name, data]) =>
        Subject(name, data)
      )}
    </main>
  );
}

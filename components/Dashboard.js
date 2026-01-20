"use client";

import { useState } from "react";
import { syllabus } from "../data/syllabus";

/* ------------------ CONFIG ------------------ */

const STATUSES = ["todo", "doing", "done", "mastered"];

const STATUS_STYLE = {
  todo: "bg-zinc-800 text-gray-300",
  doing: "bg-yellow-500/20 text-yellow-400",
  done: "bg-green-500/20 text-green-400",
  mastered: "bg-purple-500/20 text-purple-400",
};

/* ------------------ DASHBOARD ------------------ */

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState({});
  const [data, setData] = useState({});

  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

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

  /* ------------------ LESSON ------------------ */

  const Lesson = ({ lesson }) => {
    if (
      search &&
      !lesson.title.toLowerCase().includes(search.toLowerCase())
    )
      return null;

    const key = `lesson-${lesson.title}`;
    const d = data[lesson.title] || {
      status: "todo",
      revisions: 0,
      pyqs: 0,
    };

    return (
      <div className="ml-6 rounded-xl bg-zinc-900 p-4">
        <button
          onClick={() => toggle(key)}
          className="flex w-full justify-between font-medium"
        >
          {lesson.title}
          <span>{open[key] ? "▼" : "▶"}</span>
        </button>

        {open[key] && (
          <div className="mt-3 space-y-3 text-sm">
            {/* STATUS */}
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateLesson(lesson.title, { status: s })}
                  className={`px-3 py-1 rounded ${
                    d.status === s ? STATUS_STYLE[s] : "bg-zinc-800"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            {/* COUNTERS */}
            <div className="flex gap-6">
              <button
                onClick={() =>
                  updateLesson(lesson.title, {
                    revisions: Math.max(0, d.revisions - 1),
                  })
                }
                className="text-blue-400"
              >
                −
              </button>
              <span>Revisions: {d.revisions}</span>
              <button
                onClick={() =>
                  updateLesson(lesson.title, {
                    revisions: d.revisions + 1,
                  })
                }
                className="text-blue-400"
              >
                +
              </button>
            </div>

            <div className="flex gap-6">
              <button
                onClick={() =>
                  updateLesson(lesson.title, {
                    pyqs: Math.max(0, d.pyqs - 1),
                  })
                }
                className="text-pink-400"
              >
                −
              </button>
              <span>PYQs: {d.pyqs}</span>
              <button
                onClick={() =>
                  updateLesson(lesson.title, {
                    pyqs: d.pyqs + 1,
                  })
                }
                className="text-pink-400"
              >
                +
              </button>
            </div>

            {/* LINKS */}
            <div className="flex gap-4 text-blue-400">
              {lesson.video && (
                <a href={lesson.video} target="_blank">
                  Lesson Video
                </a>
              )}
              {lesson.pyq && (
                <a href={lesson.pyq} target="_blank">
                  PYQs
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ------------------ SUBJECT ------------------ */

  const Subject = ({ name, value }) => {
    const key = `subject-${name}`;

    return (
      <div className="rounded-2xl bg-zinc-900 p-5">
        <button
          onClick={() => toggle(key)}
          className="flex w-full justify-between text-lg font-semibold"
        >
          {name}
          <span>{open[key] ? "▼" : "▶"}</span>
        </button>

        {open[key] && (
          <div className="mt-4 space-y-4">
            {/* SIMPLE SUBJECT */}
            {Array.isArray(value) &&
              value.map((lesson) => (
                <Lesson key={lesson.title} lesson={lesson} />
              ))}

            {/* NESTED SUBJECT */}
            {!Array.isArray(value) &&
              Object.entries(value).map(([sub, lessons]) => {
                const subKey = `${key}-${sub}`;
                return (
                  <div key={sub} className="ml-4">
                    <button
                      onClick={() => toggle(subKey)}
                      className="flex w-full justify-between font-medium text-gray-300"
                    >
                      {sub}
                      <span>{open[subKey] ? "▼" : "▶"}</span>
                    </button>

                    {open[subKey] && (
                      <div className="mt-3 space-y-3">
                        {lessons.map((lesson) => (
                          <Lesson
                            key={lesson.title}
                            lesson={lesson}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  /* ------------------ UI ------------------ */

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Dashboard – Class 9
        </h1>
        <button className="text-red-500">Logout</button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search lessons..."
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none"
      />

      {Object.entries(syllabus).map(([name, value]) => (
        <Subject key={name} name={name} value={value} />
      ))}
    </main>
  );
}

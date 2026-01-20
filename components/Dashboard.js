"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";

const STATUS = ["todo", "doing", "done", "mastered"];

const STATUS_STYLE = {
  todo: "bg-zinc-800",
  doing: "bg-yellow-500/20 text-yellow-400",
  done: "bg-green-500/20 text-green-400",
  mastered: "bg-purple-500/20 text-purple-400",
};

const STORAGE_KEY = "study-tracker-class-9";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState({});
  const [data, setData] = useState({});

  /* ---------- LOAD FROM LOCALSTORAGE ---------- */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);

  /* ---------- SAVE ---------- */
  const saveProgress = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    alert("Progress saved ✅");
  };

  /* ---------- RESET ---------- */
  const resetProgress = () => {
    if (confirm("Reset all progress?")) {
      setData({});
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const toggle = (key) =>
    setOpen((p) => ({ ...p, [key]: !p[key] }));

  const updateLesson = (id, patch) => {
    setData((prev) => ({
      ...prev,
      [id]: {
        status: "todo",
        revisions: 0,
        pyqs: 0,
        ...prev[id],
        ...patch,
      },
    }));
  };

  /* ---------- PROGRESS ---------- */
  const totalLessons = Object.values(syllabus)
    .flatMap((v) =>
      Array.isArray(v)
        ? v
        : Object.values(v).flat()
    ).length;

  const completed = Object.values(data).filter(
    (l) => l.status === "done" || l.status === "mastered"
  ).length;

  const progress = totalLessons
    ? Math.round((completed / totalLessons) * 100)
    : 0;

  /* ---------- LESSON ---------- */
  const Lesson = ({ lesson, index }) => {
    const id = lesson.title;
    const l = data[id] || {};
    const key = `lesson-${id}`;

    if (
      search &&
      !lesson.title.toLowerCase().includes(search.toLowerCase())
    )
      return null;

    return (
      <div className="ml-6 mt-3 rounded-xl bg-zinc-900 p-4">
        <button
          onClick={() => toggle(key)}
          className="flex w-full justify-between font-medium"
        >
          <span>{index + 1}. {lesson.title}</span>
          <span>{open[key] ? "▼" : "▶"}</span>
        </button>

        {open[key] && (
          <div className="mt-3 space-y-3 text-sm">
            {/* STATUS */}
            <div className="flex gap-2 flex-wrap">
              {STATUS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateLesson(id, { status: s })}
                  className={`px-3 py-1 rounded ${
                    l.status === s ? STATUS_STYLE[s] : "bg-zinc-800"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            {/* COUNTERS */}
            <div className="flex gap-6">
              <div>
                Revisions:
                <button onClick={() =>
                  updateLesson(id, { revisions: Math.max(0, (l.revisions || 0) - 1) })
                }> − </button>
                {l.revisions || 0}
                <button onClick={() =>
                  updateLesson(id, { revisions: (l.revisions || 0) + 1 })
                }> + </button>
              </div>

              <div>
                PYQs:
                <button onClick={() =>
                  updateLesson(id, { pyqs: Math.max(0, (l.pyqs || 0) - 1) })
                }> − </button>
                {l.pyqs || 0}
                <button onClick={() =>
                  updateLesson(id, { pyqs: (l.pyqs || 0) + 1 })
                }> + </button>
              </div>
            </div>

            {/* LINKS */}
            <div className="flex gap-4 text-blue-400">
              {lesson.video && (
                <a href={lesson.video} target="_blank">Lesson Video</a>
              )}
              {lesson.pyq && (
                <a href={lesson.pyq} target="_blank">PYQs</a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ---------- SUBJECT ---------- */
  const Subject = (name, value) => {
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
          <div className="mt-4">
            {Array.isArray(value) &&
              value.map((l, i) => (
                <Lesson key={l.title} lesson={l} index={i} />
              ))}

            {!Array.isArray(value) &&
              Object.entries(value).map(([sub, lessons]) => {
                const subKey = `${key}-${sub}`;
                return (
                  <div key={sub} className="ml-4 mt-4">
                    <button
                      onClick={() => toggle(subKey)}
                      className="flex justify-between w-full font-medium text-gray-300"
                    >
                      {sub}
                      <span>{open[subKey] ? "▼" : "▶"}</span>
                    </button>

                    {open[subKey] &&
                      lessons.map((l, i) => (
                        <Lesson key={l.title} lesson={l} index={i} />
                      ))}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Dashboard – Class 9</h1>
        <button className="text-red-500">Logout</button>
      </div>

      {/* CLASS SELECTOR */}
      <div className="flex gap-2">
        <button className="bg-blue-600 px-3 py-1 rounded">9th</button>
        <button className="opacity-40 cursor-not-allowed">10th 🚧</button>
        <button className="opacity-40 cursor-not-allowed">11th 🚧</button>
        <button className="opacity-40 cursor-not-allowed">12th 🚧</button>
        <button className="opacity-40 cursor-not-allowed">JEE/NEET 🚧</button>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button onClick={saveProgress} className="bg-green-600 px-4 py-2 rounded">
          Save
        </button>
        <button onClick={resetProgress} className="bg-red-600 px-4 py-2 rounded">
          Reset
        </button>
      </div>

      {/* PROGRESS */}
      <div>
        <p>Overall Progress — {progress}%</p>
        <div className="h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-blue-500 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search lessons..."
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none"
      />

      {/* SUBJECTS */}
      {Object.entries(syllabus).map(([n, v]) => (
        <Subject key={n} name={n} value={v} />
      ))}
    </main>
  );
}

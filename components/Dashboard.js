"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";

/* ---------------- CONFIG ---------------- */

const DEFAULT_LESSON = {
  status: "todo",
  revisions: 0,
  pyqs: 0,
};

/* ---------------- COMPONENT ---------------- */

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState({});
  const [lessonData, setLessonData] = useState({});

  /* ---------- LOAD / SAVE ---------- */

  useEffect(() => {
    const saved = localStorage.getItem("lessonData");
    if (saved) setLessonData(JSON.parse(saved));
  }, []);

  const saveProgress = () => {
    localStorage.setItem("lessonData", JSON.stringify(lessonData));
    alert("Progress saved");
  };

  const resetProgress = () => {
    if (confirm("Reset all progress?")) {
      setLessonData({});
      localStorage.removeItem("lessonData");
    }
  };

  /* ---------- HELPERS ---------- */

  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateLesson = (id, patch) => {
    setLessonData((prev) => ({
      ...prev,
      [id]: {
        ...DEFAULT_LESSON,
        ...prev[id],
        ...patch,
      },
    }));
  };

  /* ---------- RENDER LESSON ---------- */

  const renderLesson = (lesson, subjectKey) => {
    if (!lesson?.title) return null;

    if (
      search &&
      !lesson.title.toLowerCase().includes(search.toLowerCase())
    )
      return null;

    const id = `${subjectKey}::${lesson.title}`;
    const data = lessonData[id] || DEFAULT_LESSON;
    const openKey = `lesson-${id}`;

    return (
      <div key={id} className="ml-6 mt-3 rounded-xl bg-zinc-900 p-4">
        <button
          onClick={() => toggle(openKey)}
          className="flex items-center gap-2 w-full text-left font-medium"
        >
          <span>{open[openKey] ? "▼" : "▶"}</span>
          <span>{lesson.title}</span>
        </button>

        {open[openKey] && (
          <div className="mt-4 space-y-4 text-sm">
            {/* STATUS */}
            <div className="flex gap-2 flex-wrap">
              {["todo", "doing", "done", "mastered"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateLesson(id, { status: s })}
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

            {/* REVISIONS / PYQS */}
            <div className="flex gap-8">
              <Counter
                label="Revisions"
                color="text-green-400"
                value={data.revisions}
                onChange={(v) =>
                  updateLesson(id, { revisions: v })
                }
              />
              <Counter
                label="PYQs"
                color="text-pink-400"
                value={data.pyqs}
                onChange={(v) => updateLesson(id, { pyqs: v })}
              />
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

  /* ---------- RENDER SUBJECT ---------- */

  const renderSubject = (name, data) => {
    const key = `subject-${name}`;

    return (
      <div key={name} className="rounded-2xl bg-zinc-900 p-5">
        <button
          onClick={() => toggle(key)}
          className="flex justify-between w-full text-left text-lg font-semibold"
        >
          {name}
          <span>{open[key] ? "▼" : "▶"}</span>
        </button>

        {open[key] && (
          <div className="mt-4">
            {Array.isArray(data) &&
              data.map((l) => renderLesson(l, name))}

            {!Array.isArray(data) &&
              Object.entries(data).map(([sub, lessons]) => (
                <div key={sub} className="ml-4 mt-4">
                  <button
                    onClick={() =>
                      toggle(`${key}-${sub}`)
                    }
                    className="flex items-center gap-2 font-medium text-gray-300"
                  >
                    <span>
                      {open[`${key}-${sub}`] ? "▼" : "▶"}
                    </span>
                    {sub}
                  </button>

                  {open[`${key}-${sub}`] &&
                    lessons.map((l) =>
                      renderLesson(l, `${name}-${sub}`)
                    )}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  /* ---------- UI ---------- */

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Dashboard – Class 9
        </h1>
        <button className="text-red-500">Logout</button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={saveProgress}
          className="px-4 py-2 rounded bg-green-600"
        >
          Save
        </button>
        <button
          onClick={resetProgress}
          className="px-4 py-2 rounded bg-zinc-700"
        >
          Reset
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search lessons..."
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none"
      />

      {Object.entries(syllabus).map(([name, data]) =>
        renderSubject(name, data)
      )}
    </main>
  );
}

/* ---------- COUNTER COMPONENT ---------- */

function Counter({ label, value, onChange, color }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="px-2 bg-zinc-800 rounded"
      >
        −
      </button>
      <span className={color}>
        {label}: {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="px-2 bg-zinc-800 rounded"
      >
        +
      </button>
    </div>
  );
}

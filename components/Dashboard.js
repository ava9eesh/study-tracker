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
  const [selectedClass, setSelectedClass] = useState("9");

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

  /* ---------- PROGRESS ---------- */

  const allLessons = [];

  const collectLessons = (data, prefix) => {
    if (Array.isArray(data)) {
      data.forEach((l) =>
        allLessons.push(`${prefix}::${l}`)
      );
    } else {
      Object.entries(data).forEach(([k, v]) =>
        collectLessons(v, `${prefix}-${k}`)
      );
    }
  };

  Object.entries(syllabus).forEach(([k, v]) =>
    collectLessons(v, k)
  );

  const completed = allLessons.filter(
    (id) => lessonData[id]?.status === "done" || lessonData[id]?.status === "mastered"
  ).length;

  const progress =
    allLessons.length === 0
      ? 0
      : Math.round((completed / allLessons.length) * 100);

  /* ---------- RENDER LESSON ---------- */

  const renderLesson = (lesson, subjectKey) => {
    if (typeof lesson !== "string") return null;

    if (
      search &&
      !lesson.toLowerCase().includes(search.toLowerCase())
    )
      return null;

    const id = `${subjectKey}::${lesson}`;
    const data = lessonData[id] || DEFAULT_LESSON;
    const openKey = `lesson-${id}`;

    return (
      <div key={id} className="ml-6 mt-3 rounded-xl bg-zinc-900 p-4">
        <button
          onClick={() => toggle(openKey)}
          className="flex items-center gap-2 w-full text-left font-medium"
        >
          <span>{open[openKey] ? "▼" : "▶"}</span>
          {lesson}
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
                value={data.revisions}
                onChange={(v) =>
                  updateLesson(id, { revisions: v })
                }
              />
              <Counter
                label="PYQs"
                value={data.pyqs}
                onChange={(v) =>
                  updateLesson(id, { pyqs: v })
                }
              />
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
              Object.entries(data).map(([sub, lessons]) => {
                const subKey = `${key}-${sub}`;
                return (
                  <div key={sub} className="ml-4 mt-4">
                    <button
                      onClick={() => toggle(subKey)}
                      className="flex items-center gap-2 font-medium text-gray-300"
                    >
                      <span>{open[subKey] ? "▼" : "▶"}</span>
                      {sub}
                    </button>
                    {open[subKey] &&
                      lessons.map((l) =>
                        renderLesson(l, `${name}-${sub}`)
                      )}
                  </div>
                );
              })}
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
          Dashboard – Class {selectedClass}
        </h1>
        <button className="text-red-500">Logout</button>
      </div>

      {/* CLASS SELECTOR */}
      <div className="flex gap-2">
        {["9", "10", "11", "12", "JEE/NEET"].map((c) => (
          <button
            key={c}
            disabled={c !== "9"}
            onClick={() => setSelectedClass(c)}
            className={`px-3 py-1 rounded ${
              selectedClass === c
                ? "bg-blue-600"
                : "bg-zinc-800 opacity-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* PROGRESS */}
      <div>
        <div className="mb-1 text-sm">
          Overall Progress — {progress}%
        </div>
        <div className="h-2 rounded bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </div>
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

/* ---------- COUNTER ---------- */

function Counter({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="px-2 bg-zinc-800 rounded"
      >
        −
      </button>
      <span>
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

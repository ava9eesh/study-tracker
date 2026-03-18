"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";

const STATUS = ["todo", "doing", "done", "mastered"];

const SUBJECT_TOTALS = {
  Science: 12,
  Mathematics: 12,
  SST: 20,
  English: 25,
  Hindi: 14,
};

export default function Dashboard() {
  const CLASSES = ["9", "10", "11", "12", "JEE"];
  const [currentClass, setCurrentClass] = useState("9");
  const [open, setOpen] = useState({});
  const [search, setSearch] = useState("");
  const [lessonData, setLessonData] = useState({});

  /* -------------------- PERSISTENCE -------------------- */
  useEffect(() => {
    const saved = localStorage.getItem(`lessonData_class${currentClass}`);
    if (saved) setLessonData(JSON.parse(saved));
    else setLessonData({});
  }, [currentClass]);

  const saveProgress = () => {
    localStorage.setItem(
      `lessonData_class${currentClass}`,
      JSON.stringify(lessonData)
    );
    alert(`Class ${currentClass} progress saved`);
  };

  const resetProgress = () => {
    if (!confirm("Reset progress for this class?")) return;
    setLessonData({});
    localStorage.removeItem(`lessonData_class${currentClass}`);
  };

  /* -------------------- HELPERS -------------------- */
  const toggle = (key) =>
    setOpen((p) => ({ ...p, [key]: !p[key] }));

  const updateLesson = (id, patch) => {
    setLessonData((p) => ({
      ...p,
      [id]: {
        status: "todo",
        revisions: 0,
        pyqs: 0,
        ...p[id],
        ...patch,
      },
    }));
  };

  /* -------------------- RENDER LESSON -------------------- */
  const renderLesson = (lesson, meta) => {
    if (search && !lesson.toLowerCase().includes(search.toLowerCase()))
      return null;

    const id = lesson;
    const data = lessonData[id] || {
      status: "todo",
      revisions: 0,
      pyqs: 0,
    };

    const lessonId = lesson
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    return (
      <div key={id} className="ml-6 mt-3 rounded-xl bg-zinc-900 p-4">
        <div className="font-medium">{lesson}</div>

        {/* STATUS */}
        <div className="mt-2 flex gap-2 flex-wrap">
          {STATUS.map((s) => (
            <button
              key={s}
              onClick={() => updateLesson(id, { status: s })}
              className={`px-3 py-1 rounded text-sm ${
                data.status === s ? "bg-blue-600" : "bg-zinc-800"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        {/* COUNTERS */}
        <div className="mt-2 flex gap-6 text-sm">
          <button onClick={() =>
            updateLesson(id, { revisions: Math.max(0, data.revisions - 1) })
          }>−</button>

          <span>Revisions: {data.revisions}</span>

          <button onClick={() =>
            updateLesson(id, { revisions: data.revisions + 1 })
          }>+</button>

          <button onClick={() =>
            updateLesson(id, { pyqs: Math.max(0, data.pyqs - 1) })
          }>−</button>

          <span>PYQs: {data.pyqs}</span>

          <button onClick={() =>
            updateLesson(id, { pyqs: data.pyqs + 1 })
          }>+</button>
        </div>

        {/* LINKS */}
        <div className="mt-2 flex gap-4 text-sm text-blue-400">
          {meta?.video && (
            <a href={meta.video} target="_blank" className="hover:underline">
              Lesson Video
            </a>
          )}
          {meta?.pyq && (
            <a href={meta.pyq} target="_blank" className="hover:underline">
              PYQs
            </a>
          )}
        </div>

        {/* ACTION */}
        {data.status === "todo" && (
          <a href={`/lesson/${lessonId}/prerequisites`}
            className="mt-2 block text-blue-400 hover:underline">
            → Previous Knowledge Required
          </a>
        )}

        {data.status === "done" && (
          <a href={`/quiz/${lessonId}?marks=40`}
            className="mt-2 block text-green-400 hover:underline">
            → Done? Let’s test
          </a>
        )}

        {data.status === "mastered" && (
          <a href={`/quiz/${lessonId}?marks=80`}
            className="mt-2 block text-purple-400 hover:underline">
            → Mastered? Let’s see
          </a>
        )}
      </div>
    );
  };

  /* -------------------- RENDER TREE -------------------- */
  const renderNode = (node) => {
    if (Array.isArray(node)) {
      return node.map((lesson) => {
        const name = typeof lesson === "string" ? lesson : lesson.name;
        const meta = typeof lesson === "string" ? {} : lesson;
        return renderLesson(name, meta);
      });
    }

    return Object.entries(node).map(([key, value]) => (
      <div key={key} className="ml-4 mt-4">
        <button
          onClick={() => toggle(key)}
          className="flex items-center gap-3 font-medium"
        >
          <span>{open[key] ? "▼" : "▶"}</span>
          <span>{key}</span>
        </button>

        {open[key] && <div className="mt-2">{renderNode(value)}</div>}
      </div>
    ));
  };

  /* -------------------- UI -------------------- */
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Dashboard – Class {currentClass}
      </h1>

      {/* CLASS SELECTOR */}
      <div className="flex gap-2 flex-wrap">
        {CLASSES.map((cls) => (
          <button
            key={cls}
            onClick={() => setCurrentClass(cls)}
            className={`px-4 py-1 rounded ${
              currentClass === cls ? "bg-blue-600" : "bg-zinc-800"
            }`}
          >
            Class {cls}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search lessons..."
        className="w-full rounded-xl bg-zinc-900 px-4 py-3"
      />

      {/* SUBJECTS */}
      {Object.entries(syllabus[currentClass] || {}).map(([n, d]) => (
        <div key={n} className="rounded-2xl bg-zinc-900 p-5">
          <button
            onClick={() => toggle(n)}
            className="flex justify-between w-full"
          >
            <span>{n}</span>
            <span>{open[n] ? "▼" : "▶"}</span>
          </button>

          {open[n] && <div className="mt-4">{renderNode(d)}</div>}
        </div>
      ))}
    </main>
  );
}
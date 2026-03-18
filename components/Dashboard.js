"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";

const STATUS = ["todo", "doing", "done", "mastered"];

const SUBJECT_TOTALS = {
  Science: 13,
  Mathematics: 13,
  SST: 20,
  English: 25,
  Hindi: 14,

  History: 5,
  Civics: 6,
  Geography: 7,
  Economics: 5,

  FirstFlight: 11,
  Footprints: 10,
  Beehive: 17,
  Moments: 9,
  Sparsh: 11,
  Sanchayan: 4,
};

export default function Dashboard() {
  const CLASSES = ["9", "10"];
  const [currentClass, setCurrentClass] = useState("9");
  const [open, setOpen] = useState({});
  const [search, setSearch] = useState("");
  const [lessonData, setLessonData] = useState({});

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    const saved = localStorage.getItem(`lessonData_class${currentClass}`);
    if (saved) setLessonData(JSON.parse(saved));
    else setLessonData({});
  }, [currentClass]);

  /* -------------------- SAVE -------------------- */
  const saveProgress = () => {
    localStorage.setItem(
      `lessonData_class${currentClass}`,
      JSON.stringify(lessonData)
    );
    alert(`Class ${currentClass} progress saved`);
  };

  const resetProgress = () => {
    if (!confirm("Reset progress?")) return;
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

  /* -------------------- COUNT -------------------- */
  const countCompletedLessons = (node) => {
    if (Array.isArray(node)) {
      return node.filter((lesson) => {
        const name =
          typeof lesson === "string" ? lesson : lesson.name;
        return (
          lessonData[name]?.status === "done" ||
          lessonData[name]?.status === "mastered"
        );
      }).length;
    }

    if (typeof node === "object" && node !== null) {
      return Object.values(node).reduce(
        (sum, v) => sum + countCompletedLessons(v),
        0
      );
    }

    return 0;
  };

  /* -------------------- LESSON -------------------- */
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
      <div key={id} className="ml-6 mt-3 bg-zinc-900 p-4 rounded-xl">
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
          <button
            onClick={() =>
              updateLesson(id, {
                revisions: Math.max(0, data.revisions - 1),
              })
            }
          >
            −
          </button>
          <span>Revisions: {data.revisions}</span>
          <button
            onClick={() =>
              updateLesson(id, { revisions: data.revisions + 1 })
            }
          >
            +
          </button>

          <button
            onClick={() =>
              updateLesson(id, {
                pyqs: Math.max(0, data.pyqs - 1),
              })
            }
          >
            −
          </button>
          <span>PYQs: {data.pyqs}</span>
          <button
            onClick={() =>
              updateLesson(id, { pyqs: data.pyqs + 1 })
            }
          >
            +
          </button>
        </div>

        {/* LINKS */}
        <div className="mt-2 flex gap-4 text-sm text-blue-400">
          {meta?.video && (
            <a href={meta.video} target="_blank">
              Lesson Video
            </a>
          )}
          {meta?.pyq && (
            <a href={meta.pyq} target="_blank">
              PYQs
            </a>
          )}
        </div>

        {/* STATUS ACTION */}
        {data.status === "todo" && (
          <a
            href={`/lesson/${lessonId}/prerequisites`}
            className="block mt-2 text-blue-400"
          >
            → Previous Knowledge Required
          </a>
        )}

        {data.status === "done" && (
          <a
            href={`/quiz/${lessonId}?marks=40`}
            className="block mt-2 text-green-400"
          >
            → Done? Test (40 marks)
          </a>
        )}

        {data.status === "mastered" && (
          <a
            href={`/quiz/${lessonId}?marks=80`}
            className="block mt-2 text-purple-400"
          >
            → Mastered? Test (80 marks)
          </a>
        )}
      </div>
    );
  };

  /* -------------------- RECURSIVE -------------------- */
  const renderNode = (node) => {
    if (Array.isArray(node)) {
      return node.map((lesson) => {
        const name =
          typeof lesson === "string" ? lesson : lesson.name;
        const meta = typeof lesson === "string" ? {} : lesson;

        return renderLesson(name, meta);
      });
    }

    return Object.entries(node).map(([key, value]) => {
      const completed = countCompletedLessons(value);
      const total = SUBJECT_TOTALS[key] ?? 0;

      return (
        <div key={key} className="ml-4 mt-4">
          <button
            onClick={() => toggle(key)}
            className="flex gap-3 font-medium"
          >
            <span>{open[key] ? "▼" : "▶"}</span>
            <span>{key}</span>
            <span className="text-sm text-gray-400">
              {completed}/{total}
            </span>
          </button>

          {open[key] && (
            <div className="mt-2">
              {renderNode(value)}
            </div>
          )}
        </div>
      );
    });
  };

  /* -------------------- UI -------------------- */
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Dashboard – Class {currentClass}
      </h1>

      {/* CLASS SELECT */}
      <div className="flex gap-2">
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

      {/* SAVE RESET */}
      <div className="flex gap-3">
        <button
          onClick={saveProgress}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Save
        </button>

        <button
          onClick={resetProgress}
          className="bg-zinc-700 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search lessons..."
        className="w-full bg-zinc-900 p-3 rounded-xl"
      />

      {/* SUBJECTS */}
      {Object.entries(syllabus[currentClass] || {}).map(([n, d]) => (
        <div key={n} className="bg-zinc-900 p-5 rounded-2xl">
          <button
            onClick={() => toggle(n)}
            className="flex justify-between w-full font-semibold"
          >
            <span>{n}</span>
            <span className="text-gray-400 text-sm">
              {countCompletedLessons(d)}/{SUBJECT_TOTALS[n] ?? 0}
            </span>
          </button>

          {open[n] && <div className="mt-3">{renderNode(d)}</div>}
        </div>
      ))}
    </main>
  );
}
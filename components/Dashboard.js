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

  History: 5,
  Civics: 5,
  Geography: 6,
  Economics: 4,

  Beehive: 17,
  Moments: 8,
  Sparsh: 10,
  Sanchayan: 4,
};

const CLASSES = ["9", "10", "11", "12", "JEE"];

const [currentClass, setCurrentClass] = useState("9");



export default function Dashboard() {
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
  const renderLesson = (lesson, meta, path) => {
    if (
      search &&
      !lesson.toLowerCase().includes(search.toLowerCase())
    )
      return null;

    const id = lesson;
    const data = lessonData[id] || {
      status: "todo",
      revisions: 0,
      pyqs: 0,
    };

    return (
      <div key={id} className="ml-6 mt-3 rounded-xl bg-zinc-900 p-4">
        <div className="font-medium">{lesson}</div>

        <div className="mt-2 flex gap-2 flex-wrap">
          {STATUS.map((s) => (
            <button
              key={s}
              onClick={() => updateLesson(id, { status: s })}
              className={`px-3 py-1 rounded text-sm ${data.status === s
                  ? "bg-blue-600"
                  : "bg-zinc-800"}`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-6 text-sm">
          <button
            onClick={() => updateLesson(id, {
              revisions: Math.max(0, data.revisions - 1),
            })}
          >
            −
          </button>
          <span>Revisions: {data.revisions}</span>
          <button
            onClick={() => updateLesson(id, { revisions: data.revisions + 1 })}
          >
            +
          </button>

          <button
            onClick={() => updateLesson(id, {
              pyqs: Math.max(0, data.pyqs - 1),
            })}
          >
            −
          </button>
          <span>PYQs: {data.pyqs}</span>
          <button
            onClick={() => updateLesson(id, { pyqs: data.pyqs + 1 })}
          >
            +
          </button>
        </div>
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
      </div>
    );
  };

  /* -------------------- RECURSIVE RENDER -------------------- */
  const renderNode = (node, path = []) => {
  if (Array.isArray(node)) {
    return node.map((lesson) => {
      const name =
        typeof lesson === "string" ? lesson : lesson.name;
      const meta = typeof lesson === "string" ? {} : lesson;

      return renderLesson(name, meta, path);
    });
  }

  return Object.entries(node).map(([key, value]) => {
    const openKey = [...path, key].join("::");

    const completed = countCompletedLessons(value);
    const total = SUBJECT_TOTALS[key] ?? 0;

    return (
      <div key={openKey} className="ml-4 mt-4">
        <button
          onClick={() => toggle(openKey)}
          className="flex items-center gap-3 font-medium"
        >
          <span>{open[openKey] ? "▼" : "▶"}</span>

          <span>{key}</span>

          <span className="text-sm text-gray-400">
            {completed}/{total} completed
          </span>
        </button>

        {open[openKey] && (
          <div className="mt-2">
            {renderNode(value, [...path, key])}
          </div>
        )}
      </div>
    );
  });
};


  // Count total lessons inside a node
const countLessons = (node) => {
  if (Array.isArray(node)) {
    return node.filter((l) => typeof l === "string").length;
  }
  if (typeof node === "object" && node !== null) {
    return Object.values(node).reduce(
      (sum, v) => sum + countLessons(v),
      0
    );
  }
  return 0;
};

// Count completed lessons inside a node
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

  /* -------------------- SUBJECT -------------------- */
const renderSubject = (name, data) => {
  const key = `subject-${name}`;

  const completed = countCompletedLessons(data);
const total = SUBJECT_TOTALS[name] ?? 0;


  return (
    <div key={key} className="rounded-2xl bg-zinc-900 p-5">
      <button
        onClick={() => toggle(key)}
        className="flex w-full items-center justify-between text-lg font-semibold"
      >
        <div className="flex items-center gap-3">
          <span>{name}</span>
          <span className="text-sm text-gray-400">
            {completed}/{total} completed
          </span>
        </div>
        <span>{open[key] ? "▼" : "▶"}</span>
      </button>

      {open[key] && (
        <div className="mt-4">
          {renderNode(data, [name])}
        </div>
      )}
    </div>
  );
};



  /* -------------------- UI -------------------- */
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Dashboard – Class {currentClass}
        </h1>
        <button className="text-red-500">Logout</button>
      </div>

      <div className="flex gap-2 flex-wrap">
  {CLASSES.map((cls) => {
    const disabled = cls !== "9";

    return (
      <button
        key={cls}
        disabled={disabled}
        onClick={() => setCurrentClass(cls)}
        className={`px-4 py-1 rounded text-sm transition
          ${currentClass === cls
            ? "bg-blue-600"
            : "bg-zinc-800"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {cls === "JEE" ? "JEE / NEET" : `Class ${cls}`}
        {disabled && " 🚧"}
      </button>
    );
  })}
</div>


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

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search lessons..."
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none"
      />

      {Object.entries(syllabus).map(([n, d]) =>
        renderSubject(n, d)
      )}
    </main>
  );
}

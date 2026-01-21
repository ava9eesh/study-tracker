"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";

const STATUS = ["todo", "doing", "done", "mastered"];

export default function Dashboard() {
  const [open, setOpen] = useState({});
  const [search, setSearch] = useState("");
  const [lessonData, setLessonData] = useState({});

  /* -------------------- PERSISTENCE -------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("lessonData");
    if (saved) setLessonData(JSON.parse(saved));
  }, []);

  const saveProgress = () => {
    localStorage.setItem("lessonData", JSON.stringify(lessonData));
    alert("Progress saved");
  };

  const resetProgress = () => {
    if (!confirm("Reset all progress?")) return;
    setLessonData({});
    localStorage.removeItem("lessonData");
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
  
/* -------------------- PROGRESS (FIXED) -------------------- */
const collectLessonIds = (node, path = [], out = []) => {
  if (Array.isArray(node)) {
    node.forEach((lesson) => {
      if (typeof lesson === "string") {
        out.push([...path, lesson].join("::"));
      }
    });
  } else if (typeof node === "object" && node !== null) {
    Object.entries(node).forEach(([key, value]) => {
      collectLessonIds(value, [...path, key], out);
    });
  }
  return out;
};

const allLessonIds = collectLessonIds(syllabus);

const doneLessons = allLessonIds.filter((id) => {
  return (
    lessonData[id]?.status === "done" ||
    lessonData[id]?.status === "mastered"
  );
}).length;

const progress =
  allLessonIds.length === 0
    ? 0
    : Math.round((doneLessons / allLessonIds.length) * 100);


  /* -------------------- RENDER LESSON -------------------- */
  const renderLesson = (lesson, meta, path) => {
    if (
      search &&
      !lesson.toLowerCase().includes(search.toLowerCase())
    )
      return null;

    const id = [...path, lesson].join("::");
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
              className={`px-3 py-1 rounded text-sm ${
                data.status === s
                  ? "bg-blue-600"
                  : "bg-zinc-800"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

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
      return node.map((item) =>
        typeof item === "string"
          ? renderLesson(item, {}, path)
          : renderLesson(item.name, item, path)
      );
    }

    return Object.entries(node).map(([key, value]) => {
      const openKey = [...path, key].join("::");

      return (
        <div key={openKey} className="ml-4 mt-4">
          <button
            onClick={() => toggle(openKey)}
            className="flex items-center gap-2 font-medium"
          >
            <span>{open[openKey] ? "▼" : "▶"}</span>
            {key}
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

  /* -------------------- SUBJECT -------------------- */
  const renderSubject = (name, data) => {
    const key = `subject-${name}`;

    return (
      <div
        key={key}
        className="rounded-2xl bg-zinc-900 p-5"
      >
        <button
          onClick={() => toggle(key)}
          className="flex w-full items-center justify-between text-lg font-semibold"
        >
          {name}
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
          Dashboard – Class 9
        </h1>
        <button className="text-red-500">Logout</button>
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

      <div>
        <div className="mb-1 text-sm">
          Progress: {progress}%
        </div>
        <div className="h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-blue-600 rounded"
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

      {Object.entries(syllabus).map(([n, d]) =>
        renderSubject(n, d)
      )}
    </main>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import { syllabus } from "../data/syllabus";

const CLASSES = ["9th", "10th", "11th", "12th", "JEE / NEET"];
const STATUSES = ["todo", "doing", "done", "mastered"];

export default function Dashboard() {
  const [selectedClass, setSelectedClass] = useState("9th");
  const [open, setOpen] = useState({});
  const [search, setSearch] = useState("");
  const [lessonData, setLessonData] = useState({});

  /* ---------------- LOAD / SAVE ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("lessonData");
    if (saved) setLessonData(JSON.parse(saved));
  }, []);

  const saveProgress = () => {
    localStorage.setItem("lessonData", JSON.stringify(lessonData));
    alert("Progress saved ✅");
  };

  const resetProgress = () => {
    if (!confirm("Reset all progress?")) return;
    setLessonData({});
    localStorage.removeItem("lessonData");
  };

  /* ---------------- HELPERS ---------------- */
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

  /* ---------------- COLLECT ALL LESSONS (SAFE) ---------------- */
  const allLessons = useMemo(() => {
    const out = [];

    const walk = (node) => {
      if (Array.isArray(node)) {
        node.forEach((l) => {
          if (typeof l === "string") out.push(l);
        });
      } else if (typeof node === "object" && node !== null) {
        Object.values(node).forEach(walk);
      }
    };

    walk(syllabus);
    return out;
  }, []);

  /* ---------------- PROGRESS ---------------- */
  const progress = useMemo(() => {
    if (!allLessons.length) return 0;

    const done = allLessons.filter(
      (l) =>
        lessonData[l]?.status === "done" ||
        lessonData[l]?.status === "mastered"
    ).length;

    return Math.round((done / allLessons.length) * 100);
  }, [lessonData, allLessons]);

  /* ---------------- RENDER LESSON ---------------- */
  const renderLesson = (lesson, path) => {
    if (typeof lesson !== "string") return null;

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
          <div className="mt-3 space-y-3 text-sm">
            {/* STATUS */}
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateLesson(id, { status: s })}
                  className={`px-3 py-1 rounded ${
                    data.status === s
                      ? "bg-blue-600"
                      : "bg-zinc-800"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            {/* REVISIONS */}
            <div className="flex items-center gap-3">
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
                  updateLesson(id, {
                    revisions: data.revisions + 1,
                  })
                }
              >
                +
              </button>
            </div>

            {/* PYQS */}
            <div className="flex items-center gap-3">
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
                  updateLesson(id, {
                    pyqs: data.pyqs + 1,
                  })
                }
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ---------------- RECURSIVE RENDER ---------------- */
  const renderNode = (node, path = []) => {
    if (Array.isArray(node)) {
      return node.map((l) => renderLesson(l, path));
    }

    if (typeof node !== "object" || node === null) return null;

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

  /* ---------------- UI ---------------- */
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Dashboard – Class {selectedClass}
        </h1>
        <button className="text-red-500">Logout</button>
      </div>

      {/* CLASS SELECTOR */}
      <div className="flex gap-2 flex-wrap">
        {CLASSES.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedClass(c)}
            className={`px-4 py-1 rounded ${
              selectedClass === c
                ? "bg-blue-600"
                : "bg-zinc-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* PROGRESS BAR */}
      <div>
        <div className="mb-1 text-sm">
          Overall Progress — {progress}%
        </div>
        <div className="h-3 rounded bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* SAVE / RESET */}
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
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none"
      />

      {/* SYLLABUS */}
      {Object.entries(syllabus).map(([name, data]) => (
        <div
          key={name}
          className="rounded-2xl bg-zinc-900 p-5"
        >
          <button
            onClick={() => toggle(name)}
            className="flex w-full justify-between text-lg font-semibold"
          >
            {name}
            <span>{open[name] ? "▼" : "▶"}</span>
          </button>

          {open[name] && (
            <div className="mt-4">
              {renderNode(data, [name])}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}

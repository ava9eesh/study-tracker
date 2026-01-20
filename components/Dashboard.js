"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";

const CLASSES = ["9th", "10th", "11th", "12th", "JEE/NEET"];

const STATUS_WEIGHT = {
  todo: 0,
  doing: 0.5,
  done: 1,
  mastered: 1,
};

export default function Dashboard() {
  const [currentClass, setCurrentClass] = useState("9th");
  const [open, setOpen] = useState({});
  const [lessonData, setLessonData] = useState({});
  const [search, setSearch] = useState("");

  /* ---------------- SAVE / LOAD ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("study-progress");
    if (saved) setLessonData(JSON.parse(saved));
  }, []);

  const saveProgress = () => {
    localStorage.setItem("study-progress", JSON.stringify(lessonData));
    alert("Progress saved ✅");
  };

  const resetProgress = () => {
    if (confirm("Reset all progress?")) {
      setLessonData({});
      localStorage.removeItem("study-progress");
    }
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

  /* ---------------- FLATTEN LESSONS ---------------- */
  const allLessons = [];

  const walk = (data) => {
    if (Array.isArray(data)) {
      data.forEach((l) => allLessons.push(l));
    } else if (typeof data === "object") {
      Object.values(data).forEach(walk);
    }
  };
  walk(syllabus);

  const progress =
    allLessons.length === 0
      ? 0
      : Math.round(
          (allLessons.reduce((sum, l) => {
            const s = lessonData[l.title]?.status || "todo";
            return sum + STATUS_WEIGHT[s];
          }, 0) /
            allLessons.length) *
            100
        );

  /* ---------------- RENDER LESSON ---------------- */
  const Lesson = (lesson) => {
    if (
      search &&
      !lesson.title.toLowerCase().includes(search.toLowerCase())
    )
      return null;

    const data = lessonData[lesson.title] || {
      status: "todo",
      revisions: 0,
      pyqs: 0,
    };

    const key = `lesson-${lesson.title}`;

    return (
      <div key={lesson.title} className="ml-6 mt-3 rounded-xl bg-zinc-900 p-4">
        <button
          onClick={() => toggle(key)}
          className="w-full text-left font-medium"
        >
          ▶ {lesson.title}
        </button>

        {open[key] && (
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex gap-2 flex-wrap">
              {["todo", "doing", "done", "mastered"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateLesson(lesson.title, { status: s })}
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
                  updateLesson(lesson.title, {
                    revisions: data.revisions + 1,
                  })
                }
                className="text-green-400"
              >
                Revisions: {data.revisions} +
              </button>

              <button
                onClick={() =>
                  updateLesson(lesson.title, {
                    pyqs: data.pyqs + 1,
                  })
                }
                className="text-pink-400"
              >
                PYQs: {data.pyqs} +
              </button>
            </div>

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

  /* ---------------- RENDER SUBJECT ---------------- */
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
          Dashboard – Class {currentClass}
        </h1>
        <button className="text-red-500">Logout</button>
      </div>

      {/* CLASS SELECTOR */}
      <div className="flex gap-2 flex-wrap">
        {CLASSES.map((c) => (
          <button
            key={c}
            onClick={() => setCurrentClass(c)}
            className={`px-3 py-1 rounded ${
              currentClass === c
                ? "bg-blue-500 text-white"
                : "bg-zinc-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* SAVE / RESET */}
      <div className="flex gap-3">
        <button onClick={saveProgress} className="bg-green-600 px-4 py-1 rounded">
          Save
        </button>
        <button onClick={resetProgress} className="bg-zinc-700 px-4 py-1 rounded">
          Reset
        </button>
      </div>

      {/* PROGRESS */}
      <div>
        <div className="text-sm mb-1">
          Overall Progress — {progress}%
        </div>
        <div className="h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-green-500 rounded"
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

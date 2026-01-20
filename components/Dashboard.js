"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";

/* ---------------- CONFIG ---------------- */

const CLASSES = ["9th", "10th", "11th", "12th", "JEE/NEET"];
const STATUSES = ["todo", "doing", "done", "mastered"];

const STATUS_STYLE = {
  todo: "bg-zinc-800 text-gray-300",
  doing: "bg-yellow-500/20 text-yellow-400",
  done: "bg-green-500/20 text-green-400",
  mastered: "bg-purple-500/20 text-purple-400",
};

/* ---------------- DASHBOARD ---------------- */

export default function Dashboard() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [open, setOpen] = useState({});
  const [search, setSearch] = useState("");
  const [data, setData] = useState({});

  /* ---------- LOAD / SAVE ---------- */

  useEffect(() => {
    const savedClass = localStorage.getItem("class");
    const savedData = localStorage.getItem("progress");

    if (savedClass) setSelectedClass(savedClass);
    if (savedData) setData(JSON.parse(savedData));
  }, []);

  const saveProgress = () => {
    localStorage.setItem("progress", JSON.stringify(data));
    localStorage.setItem("class", selectedClass);
    alert("Progress saved");
  };

  const resetProgress = () => {
    if (!confirm("Reset all progress?")) return;
    setData({});
    localStorage.removeItem("progress");
  };

  /* ---------- HELPERS ---------- */

  const toggle = (key) =>
    setOpen((p) => ({ ...p, [key]: !p[key] }));

  const updateLesson = (title, patch) => {
    setData((prev) => ({
      ...prev,
      [title]: {
        status: "todo",
        revisions: 0,
        pyqs: 0,
        ...prev[title],
        ...patch,
      },
    }));
  };

  /* ---------- CLASS SELECTOR ---------- */

  if (!selectedClass) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="glass p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Select your class
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {CLASSES.map((c) => (
              <button
                key={c}
                disabled={c !== "9th"}
                onClick={() => setSelectedClass(c)}
                className={`rounded-lg px-4 py-2 ${
                  c === "9th"
                    ? "bg-blue-600"
                    : "bg-zinc-800 opacity-50"
                }`}
              >
                {c}
                {c !== "9th" && " 🚧"}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ---------- LESSON ---------- */

  const Lesson = ({ lesson }) => {
    if (!lesson?.title) return null;

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
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    updateLesson(lesson.title, { status: s })
                  }
                  className={`px-3 py-1 rounded ${
                    d.status === s
                      ? STATUS_STYLE[s]
                      : "bg-zinc-800"
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

  /* ---------- SUBJECT ---------- */

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
            {Array.isArray(value) &&
              value.map((l) => <Lesson key={l.title} lesson={l} />)}

            {!Array.isArray(value) &&
              Object.entries(value).map(([sub, lessons]) => {
                const subKey = `${key}-${sub}`;
                return (
                  <div key={sub} className="ml-4">
                    <button
                      onClick={() => toggle(subKey)}
                      className="flex w-full justify-between font-medium"
                    >
                      {sub}
                      <span>{open[subKey] ? "▼" : "▶"}</span>
                    </button>

                    {open[subKey] &&
                      lessons.map((l) => (
                        <Lesson key={l.title} lesson={l} />
                      ))}
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
        <button
          onClick={() => {
            localStorage.clear();
            location.reload();
          }}
          className="text-red-500"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-3">
        <button onClick={saveProgress} className="bg-green-600 px-4 py-2 rounded">
          Save
        </button>
        <button onClick={resetProgress} className="bg-zinc-800 px-4 py-2 rounded">
          Reset
        </button>
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

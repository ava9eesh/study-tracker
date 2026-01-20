"use client";

import { useState } from "react";
import { syllabus } from "../data/syllabus";

const STATUS_STYLES = {
  todo: "bg-zinc-800 text-gray-300",
  doing: "bg-yellow-500/20 text-yellow-400",
  done: "bg-green-500/20 text-green-400",
  mastered: "bg-purple-500/20 text-purple-400",
};

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [openSubjects, setOpenSubjects] = useState({});
  const [openLessons, setOpenLessons] = useState({});
  const [lessonData, setLessonData] = useState({});

  /* ---------------- helpers ---------------- */

  const toggleSubject = (name) => {
    setOpenSubjects((p) => ({ ...p, [name]: !p[name] }));
  };

  const toggleLesson = (name) => {
    setOpenLessons((p) => ({ ...p, [name]: !p[name] }));
  };

  const updateLesson = (lesson, patch) => {
    setLessonData((prev) => ({
      ...prev,
      [lesson]: {
        status: "todo",
        revisions: 0,
        pyqs: 0,
        ...prev[lesson],
        ...patch,
      },
    }));
  };

  const matchesSearch = (text) =>
    text.toLowerCase().includes(search.toLowerCase());

  /* ---------------- render lesson ---------------- */

  const renderLesson = (lesson) => {
  const title = typeof lesson === "string" ? lesson : lesson.name;
  const video = typeof lesson === "object" ? lesson.video : null;
  const pyq = typeof lesson === "object" ? lesson.pyq : null;

  if (search && !title.toLowerCase().includes(search.toLowerCase())) {
    return null;
  }

  const data = lessonData[title] || {
    status: "todo",
    revisions: 0,
    pyqs: 0,
  };

  return (
    <div key={title} className="ml-6 mt-3 rounded-xl bg-zinc-900/70 p-4">
      <button
        onClick={() => toggleLesson(title)}
        className="w-full text-left font-medium focus:outline-none"
      >
        {title}
      </button>

      {openLessons[title] && (
        <div className="mt-3 space-y-3 text-sm">
          {/* STATUS */}
          <div className="flex gap-2 flex-wrap">
            {["todo", "doing", "done", "mastered"].map((s) => (
              <button
                key={s}
                onClick={() => updateLesson(title, { status: s })}
                className={`px-3 py-1 rounded-md ${
                  data.status === s
                    ? STATUS_STYLES[s]
                    : "bg-zinc-800 text-gray-400"
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
                updateLesson(title, { revisions: data.revisions + 1 })
              }
              className="text-blue-400 hover:underline"
            >
              Revisions: {data.revisions} +
            </button>

            <button
              onClick={() =>
                updateLesson(title, { pyqs: data.pyqs + 1 })
              }
              className="text-pink-400 hover:underline"
            >
              PYQs: {data.pyqs} +
            </button>
          </div>

          {/* LINKS */}
          {(video || pyq) && (
            <div className="flex gap-4 text-sm pt-2">
              {video && (
                <a
                  href={video}
                  target="_blank"
                  className="text-blue-400 hover:underline"
                >
                  Lesson Video
                </a>
              )}
              {pyq && (
                <a
                  href={pyq}
                  target="_blank"
                  className="text-purple-400 hover:underline"
                >
                  PYQs
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


  /* ---------------- render subject ---------------- */

  const renderSubject = (name, data) => {
    return (
      <div
        key={name}
        className="rounded-2xl bg-zinc-900 p-5"
      >
        <button
          onClick={() => toggleSubject(name)}
          className="
            w-full text-left text-lg font-semibold
            focus:outline-none
          "
        >
          {name}
        </button>

        {openSubjects[name] && (
          <div className="mt-4 space-y-3">
            {Array.isArray(data) &&
              data.map(renderLesson)}

            {!Array.isArray(data) &&
              Object.entries(data).map(([sub, lessons]) => (
                <div key={sub} className="ml-4">
                  <div className="text-gray-400 font-medium mb-2">
                    {sub}
                  </div>
                  {lessons.map(renderLesson)}
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
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Dashboard – Class 9
        </h1>
        <button className="text-red-500 text-sm hover:underline">
          Logout
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search lessons..."
        className="
          w-full rounded-xl bg-zinc-900 px-4 py-3
          outline-none focus:ring-2 focus:ring-blue-500/30
        "
      />

      {/* SUBJECTS */}
      {Object.entries(syllabus).map(([name, data]) =>
        renderSubject(name, data)
      )}

      {/* FOOTER */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>
          Built by{" "}
          <span className="text-white font-medium">
            Avaneesh Shinde
          </span>
        </p>
        <p className="mt-1">
          Contact:{" "}
          <a
            href="https://discord.com/users/i_love_zandu_bam"
            target="_blank"
            className="text-blue-400 hover:underline"
          >
            i_love_zandu_bam
          </a>
        </p>
      </footer>
    </main>
  );
}

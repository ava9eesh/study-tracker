"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";

export default function Dashboard({ user }) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState({});
  const [progress, setProgress] = useState({});

  /* ---------- helpers ---------- */

  const toggleSubject = (subject) => {
    setCollapsed((prev) => ({
      ...prev,
      [subject]: !prev[subject],
    }));
  };

  const updateLesson = (lessonName, field, value) => {
    setProgress((prev) => ({
      ...prev,
      [lessonName]: {
        status: "To Do",
        revisions: 0,
        pyqs: 0,
        ...prev[lessonName],
        [field]: value,
      },
    }));
  };

  const statusClass = (active, label) => {
    if (!active) return "bg-zinc-800 text-zinc-400";
    if (label === "Doing") return "bg-yellow-500 text-black";
    if (label === "Done") return "bg-green-500 text-black";
    if (label === "Mastered") return "bg-purple-500 text-white";
    return "bg-zinc-600 text-white";
  };

  /* ---------- progress bar ---------- */

  const allLessons = [];

  const collectLessons = (block) => {
    if (Array.isArray(block)) {
      block.forEach((l) => l?.name && allLessons.push(l.name));
    } else {
      Object.values(block).forEach(collectLessons);
    }
  };

  Object.values(syllabus).forEach(collectLessons);

  const completed = allLessons.filter(
    (l) =>
      progress[l]?.status === "Done" ||
      progress[l]?.status === "Mastered"
  ).length;

  const percent =
    allLessons.length > 0
      ? Math.round((completed / allLessons.length) * 100)
      : 0;

  /* ---------- render ---------- */

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-2">
        Welcome, {user?.displayName}
      </h1>

      {/* progress */}
      <div className="mb-6">
        <div className="text-sm mb-1">Overall Progress — {percent}%</div>
        <div className="h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-green-500 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* search */}
      <input
        className="w-full mb-6 p-2 rounded bg-zinc-900 outline-none"
        placeholder="Search lessons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* subjects */}
      {Object.entries(syllabus).map(([subject, content]) => (
        <div key={subject} className="mb-6 bg-zinc-900 rounded-xl p-4">
          <button
            onClick={() => toggleSubject(subject)}
            className="w-full text-left text-lg font-semibold"
          >
            {subject}
          </button>

          {!collapsed[subject] && (
            <div className="mt-4 space-y-4">
              {renderBlock(
                content,
                search,
                progress,
                updateLesson,
                statusClass
              )}
            </div>
          )}
        </div>
      ))}

      <footer className="text-center text-sm text-zinc-500 mt-10">
        Built by Avaneesh Shinde · Contact{" "}
        <span className="text-blue-400">i_love_zandu_bam</span>
      </footer>
    </div>
  );
}

/* ---------- recursive renderer ---------- */

function renderBlock(
  block,
  search,
  progress,
  updateLesson,
  statusClass
) {
  if (Array.isArray(block)) {
    return block
      .filter(
        (lesson) =>
          typeof lesson?.name === "string" &&
          lesson.name.toLowerCase().includes(search.toLowerCase())
      )
      .map((lesson) => (
        <LessonCard
          key={lesson.name}
          lesson={lesson}
          data={progress[lesson.name] || {}}
          updateLesson={updateLesson}
          statusClass={statusClass}
        />
      ));
  }

  return Object.entries(block).map(([sub, lessons]) => (
    <div key={sub} className="ml-2">
      <h3 className="font-semibold mt-2">{sub}</h3>
      {renderBlock(
        lessons,
        search,
        progress,
        updateLesson,
        statusClass
      )}
    </div>
  ));
}

/* ---------- lesson card ---------- */

function LessonCard({ lesson, data, updateLesson, statusClass }) {
  return (
    <div className="bg-zinc-800 rounded p-3">
      <div className="font-medium mb-2">{lesson.name}</div>

      {/* status */}
      <div className="flex gap-2 mb-2">
        {["To Do", "Doing", "Done", "Mastered"].map((s) => (
          <button
            key={s}
            onClick={() => updateLesson(lesson.name, "status", s)}
            className={`px-3 py-1 rounded ${statusClass(
              data.status === s,
              s
            )}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* counters */}
      <div className="flex gap-4 text-sm mb-2">
        <div>
          Revisions: {data.revisions || 0}
          <button
            className="ml-2"
            onClick={() =>
              updateLesson(
                lesson.name,
                "revisions",
                Math.min(100, (data.revisions || 0) + 1)
              )
            }
          >
            +
          </button>
        </div>

        <div>
          PYQs: {data.pyqs || 0}
          <button
            className="ml-2"
            onClick={() =>
              updateLesson(
                lesson.name,
                "pyqs",
                Math.min(100, (data.pyqs || 0) + 1)
              )
            }
          >
            +
          </button>
        </div>
      </div>

      {/* links */}
      <div className="flex gap-4 text-sm text-blue-400">
        {lesson.video && (
          <a href={lesson.video} target="_blank" rel="noreferrer">
            Lesson Video
          </a>
        )}
        {lesson.pyq ? (
          <a href={lesson.pyq} target="_blank" rel="noreferrer">
            PYQs
          </a>
        ) : (
          <span className="text-zinc-500">PYQs</span>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";

const CLASSES = ["9th", "10th", "11th", "12th", "JEE/NEET"];

export default function Dashboard({ user }) {
  const [selectedClass, setSelectedClass] = useState("9th");
  const [search, setSearch] = useState("");
  const [collapsedSubjects, setCollapsedSubjects] = useState({});
  const [collapsedSections, setCollapsedSections] = useState({});
  const [collapsedLessons, setCollapsedLessons] = useState({});
  const [progress, setProgress] = useState({});

  /* ---------- localStorage ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("study-progress");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveProgress = () => {
    localStorage.setItem("study-progress", JSON.stringify(progress));
    alert("Progress saved ✅");
  };

  /* ---------- helpers ---------- */
  const toggle = (setter, key) => {
    setter((p) => ({ ...p, [key]: !p[key] }));
  };

  const updateLesson = (lesson, field, delta) => {
    setProgress((p) => {
      const curr = p[lesson] || {
        status: "To Do",
        revisions: 0,
        pyqs: 0,
      };

      let value = curr[field];

      if (field === "revisions" || field === "pyqs") {
        value = Math.min(100, Math.max(0, curr[field] + delta));
      } else {
        value = delta;
      }

      return {
        ...p,
        [lesson]: { ...curr, [field]: value },
      };
    });
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
  const collect = (block) => {
    if (Array.isArray(block)) block.forEach((l) => l?.name && allLessons.push(l.name));
    else Object.values(block).forEach(collect);
  };
  collect(syllabus);

  const completed = allLessons.filter(
    (l) => progress[l]?.status === "Done" || progress[l]?.status === "Mastered"
  ).length;

  const percent = allLessons.length
    ? Math.round((completed / allLessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-3">
        Welcome, {user?.displayName}
      </h1>

      {/* CLASS SELECTOR */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {CLASSES.map((cls) => (
          <button
            key={cls}
            disabled={cls !== "9th"}
            onClick={() => setSelectedClass(cls)}
            className={`px-3 py-1 rounded text-sm ${
              cls === "9th"
                ? selectedClass === "9th"
                  ? "bg-blue-600"
                  : "bg-zinc-800"
                : "bg-zinc-900 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {cls}
            {cls !== "9th" && " 🚧"}
          </button>
        ))}
      </div>

      {/* SAVE */}
      <button
        onClick={saveProgress}
        className="mb-4 px-4 py-2 rounded bg-green-600 text-black"
      >
        Save Progress
      </button>

      {/* PROGRESS BAR */}
      <div className="mb-6">
        <div className="text-sm mb-1">Overall Progress — {percent}%</div>
        <div className="h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-green-500 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="w-full mb-6 p-2 rounded bg-zinc-900"
        placeholder="Search lessons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* SUBJECTS */}
      {Object.entries(syllabus).map(([subject, content]) => (
        <div key={subject} className="mb-6 bg-zinc-900 rounded-xl p-4">
          <button
            onClick={() => toggle(setCollapsedSubjects, subject)}
            className="w-full text-left text-lg font-semibold"
          >
            {subject}
          </button>

          {!collapsedSubjects[subject] && (
            <div className="mt-4">
              {renderBlock(
                content,
                subject,
                search,
                progress,
                updateLesson,
                statusClass,
                collapsedSections,
                setCollapsedSections,
                collapsedLessons,
                setCollapsedLessons
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- recursive render ---------- */

function renderBlock(
  block,
  keyBase,
  search,
  progress,
  updateLesson,
  statusClass,
  collapsedSections,
  setCollapsedSections,
  collapsedLessons,
  setCollapsedLessons
) {
  if (Array.isArray(block)) {
    return block
      .filter(
        (l) =>
          typeof l?.name === "string" &&
          l.name.toLowerCase().includes(search.toLowerCase())
      )
      .map((lesson) => (
        <div key={lesson.name} className="mb-3">
          <button
            onClick={() =>
              setCollapsedLessons((p) => ({
                ...p,
                [lesson.name]: !p[lesson.name],
              }))
            }
            className="w-full text-left font-medium"
          >
            {lesson.name}
          </button>

          {!collapsedLessons[lesson.name] && (
            <LessonCard
              lesson={lesson}
              data={progress[lesson.name] || {}}
              updateLesson={updateLesson}
              statusClass={statusClass}
            />
          )}
        </div>
      ));
  }

  return Object.entries(block).map(([section, lessons]) => (
    <div key={section} className="ml-2 mt-2">
      <button
        onClick={() =>
          setCollapsedSections((p) => ({
            ...p,
            [section]: !p[section],
          }))
        }
        className="font-semibold"
      >
        {section}
      </button>

      {!collapsedSections[section] &&
        renderBlock(
          lessons,
          section,
          search,
          progress,
          updateLesson,
          statusClass,
          collapsedSections,
          setCollapsedSections,
          collapsedLessons,
          setCollapsedLessons
        )}
    </div>
  ));
}

/* ---------- lesson card ---------- */

function LessonCard({ lesson, data, updateLesson, statusClass }) {
  return (
    <div className="bg-zinc-800 rounded p-3 mt-2">
      {/* STATUS */}
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

      {/* COUNTERS */}
      <div className="flex gap-6 text-sm mb-2">
        <div>
          Revisions:
          <button
            className="mx-2"
            onClick={() => updateLesson(lesson.name, "revisions", -1)}
          >
            −
          </button>
          {data.revisions || 0}
          <button
            className="mx-2"
            onClick={() => updateLesson(lesson.name, "revisions", +1)}
          >
            +
          </button>
        </div>

        <div>
          PYQs:
          <button
            className="mx-2"
            onClick={() => updateLesson(lesson.name, "pyqs", -1)}
          >
            −
          </button>
          {data.pyqs || 0}
          <button
            className="mx-2"
            onClick={() => updateLesson(lesson.name, "pyqs", +1)}
          >
            +
          </button>
        </div>
      </div>

      {/* LINKS */}
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

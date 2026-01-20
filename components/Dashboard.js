"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";
import { loadUserData, saveUserData } from "../utils/firestore";

export default function Dashboard({ user }) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState({});
  const [progress, setProgress] = useState({});
  const uid = user.uid;

  const videoLinks = {
    "Matter in Our Surroundings":
      "https://www.youtube.com/results?search_query=matter+in+our+surroundings+class+9",
    "Is Matter Around Us Pure?":
      "https://www.youtube.com/results?search_query=is+matter+around+us+pure+class+9",
    "Atoms and Molecules":
      "https://www.youtube.com/results?search_query=atoms+and+molecules+class+9",
    "Structure of the Atom":
      "https://www.youtube.com/results?search_query=structure+of+atom+class+9",
    "The Fundamental Unit of Life":
      "https://www.youtube.com/results?search_query=cell+class+9",
    Tissues: "https://www.youtube.com/results?search_query=cell+class+9",
    Motion: "https://www.youtube.com/results?search_query=motion+class+9",
    "Force and Laws of Motion":
      "https://www.youtube.com/results?search_query=force+and+laws+of+motion+class+9",
    Gravitation:
      "https://www.youtube.com/results?search_query=gravitation+class+9",
    "Work and Energy":
      "https://www.youtube.com/results?search_query=work+and+energy+class+9",
    Sound: "https://www.youtube.com/results?search_query=sound+class+9",
    "Improvement in Food Resources":
      "https://www.youtube.com/results?search_query=improvement+in+food+resources+class+9",
  };

  // 🔥 Load Firestore on login
  useEffect(() => {
    async function load() {
      const data = await loadUserData(uid);
      if (data?.progress) setProgress(data.progress);
    }
    load();
  }, [uid]);

  // 🔥 Save Firestore on change
  useEffect(() => {
    saveUserData(uid, { progress });
  }, [progress, uid]);

  function toggleSubject(name) {
    setCollapsed((p) => ({ ...p, [name]: !p[name] }));
  }

  function updateLesson(lesson, field, value) {
    setProgress((p) => ({
      ...p,
      [lesson]: { ...p[lesson], [field]: value },
    }));
  }

  function statusColor(active, name) {
    if (!active) return "bg-zinc-800 text-zinc-400";
    if (name === "Doing") return "bg-yellow-500 text-black";
    if (name === "Done") return "bg-green-500 text-black";
    if (name === "Mastered") return "bg-purple-500 text-white";
    return "bg-zinc-600";
  }

  const allLessons = Object.values(syllabus)
    .flatMap((v) =>
      Array.isArray(v) ? v : Object.values(v).flat()
    )
    .flat();

  const completed = allLessons.filter(
    (l) =>
      progress[l]?.status === "Done" ||
      progress[l]?.status === "Mastered"
  ).length;

  const percent = Math.round((completed / allLessons.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-2">
        Welcome, {user.displayName}
      </h1>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="text-sm mb-1">Overall Progress: {percent}%</div>
        <div className="h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-green-500 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <input
        placeholder="Search lessons..."
        className="w-full mb-6 p-2 rounded bg-zinc-900"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {Object.entries(syllabus).map(([subject, content]) => (
        <div key={subject} className="mb-6 bg-zinc-900 rounded-xl p-4">
          <button
            className="text-lg font-semibold w-full text-left"
            onClick={() => toggleSubject(subject)}
          >
            {subject}
          </button>

          {!collapsed[subject] && (
            <div className="mt-4 space-y-4">
              {renderLessons(
                content,
                search,
                progress,
                updateLesson,
                videoLinks,
                statusColor
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

function renderLessons(
  content,
  search,
  progress,
  updateLesson,
  videoLinks,
  statusColor
) {
  if (Array.isArray(content)) {
    return content
      .filter(
        (l) =>
          typeof l === "string" &&
          l.toLowerCase().includes(search.toLowerCase())
      )
      .map((lesson) => (
        <LessonCard
          key={lesson}
          lesson={lesson}
          data={progress[lesson] || {}}
          updateLesson={updateLesson}
          videoLinks={videoLinks}
          statusColor={statusColor}
        />
      ));
  }

  return Object.entries(content).map(([sub, lessons]) => (
    <div key={sub}>
      <h3 className="font-semibold mt-2">{sub}</h3>
      {renderLessons(
        lessons,
        search,
        progress,
        updateLesson,
        videoLinks,
        statusColor
      )}
    </div>
  ));
}

function LessonCard({
  lesson,
  data,
  updateLesson,
  videoLinks,
  statusColor,
}) {
  return (
    <div className="bg-zinc-800 rounded p-3">
      <div className="font-medium mb-2">{lesson}</div>

      <div className="flex gap-2 mb-2">
        {["To Do", "Doing", "Done", "Mastered"].map((s) => (
          <button
            key={s}
            onClick={() => updateLesson(lesson, "status", s)}
            className={`px-3 py-1 rounded ${statusColor(
              data.status === s,
              s
            )}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-4 text-sm mb-2">
        <div>
          Revisions: {data.revisions || 0}
          <button
            className="ml-2"
            onClick={() =>
              updateLesson(
                lesson,
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
                lesson,
                "pyqs",
                Math.min(100, (data.pyqs || 0) + 1)
              )
            }
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-blue-400">
        {videoLinks[lesson] && (
          <a href={videoLinks[lesson]} target="_blank">
            Lesson Video
          </a>
        )}
        <span className="text-zinc-500">PYQs</span>
      </div>
    </div>
  );
}

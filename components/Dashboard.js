"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";
import { db } from "../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Dashboard({ user, logout }) {
  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState({});

  const uid = user.uid;

  useEffect(() => {
    getDoc(doc(db, "users", uid)).then((snap) => {
      if (snap.exists()) setProgress(snap.data().progress || {});
    });
  }, [uid]);

  function save(updated) {
    setProgress(updated);
    setDoc(doc(db, "users", uid), { progress: updated }, { merge: true });
  }

  function update(lesson, field, value) {
    save({
      ...progress,
      [lesson]: { status: "todo", revisions: 0, pyqs: 0, ...progress[lesson], [field]: value },
    });
  }

  const totalLessons = Object.values(syllabus).flat().length;
  const completed = Object.values(progress).filter(
    (l) => l?.status === "done" || l?.status === "mastered"
  ).length;

  return (
    <div className="p-6 text-white">
      <button onClick={logout} className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded">Logout</button>

      <h1 className="text-2xl mb-2">Dashboard – Class 9th</h1>

      {/* SEARCH */}
      <input
        placeholder="Search lessons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 bg-zinc-800 rounded"
      />

      {/* PROGRESS */}
      <div className="mb-6">
        <div className="flex justify-between text-sm">
          <span>Overall Progress</span>
          <span>{Math.round((completed / totalLessons) * 100)}%</span>
        </div>
        <div className="h-2 bg-zinc-700 rounded">
          <div className="h-2 bg-green-500 rounded" style={{ width: `${(completed / totalLessons) * 100}%` }} />
        </div>
      </div>

      {/* SUBJECTS */}
      {Object.entries(syllabus).map(([subject, lessons]) => (
        <div key={subject} className="mb-6">
          <button
            onClick={() => setOpen({ ...open, [subject]: !open[subject] })}
            className="text-xl font-semibold mb-2"
          >
            {subject}
          </button>

          {open[subject] &&
            lessons
              .filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
              .map((lesson) => {
                const d = progress[lesson.name] || { status: "todo", revisions: 0, pyqs: 0 };

                return (
                  <div key={lesson.name} className="bg-zinc-900 p-4 rounded mb-3">
                    <h3>{lesson.name}</h3>

                    <div className="flex gap-2 mt-2">
                      {["todo", "doing", "done", "mastered"].map((s) => (
                        <button
                          key={s}
                          onClick={() => update(lesson.name, "status", s)}
                          className={`px-2 py-1 rounded ${
                            s === "doing" ? "bg-yellow-600" :
                            s === "done" ? "bg-green-600" :
                            s === "mastered" ? "bg-purple-600" : "bg-gray-600"
                          }`}
                        >
                          {s.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div className="text-sm mt-2">
                      Revisions: {d.revisions}
                      <button onClick={() => update(lesson.name, "revisions", Math.min(100, d.revisions + 1))}> + </button>
                      <br />
                      PYQs: {d.pyqs}
                      <button onClick={() => update(lesson.name, "pyqs", Math.min(100, d.pyqs + 1))}> + </button>
                    </div>

                    <div className="flex gap-4 mt-2 text-sm">
                      {lesson.video && <a href={lesson.video} target="_blank" className="text-blue-400">Lesson Video</a>}
                      {lesson.pyq && <a href={lesson.pyq} target="_blank" className="text-purple-400">PYQs</a>}
                    </div>
                  </div>
                );
              })}
        </div>
      ))}
    </div>
  );
}

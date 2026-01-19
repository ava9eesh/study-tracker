"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";
import { db } from "../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Dashboard({ user }) {
  const [progress, setProgress] = useState({});

  const uid = user.uid;

  // LOAD FROM FIRESTORE
  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setProgress(snap.data().progress || {});
      }
    }
    load();
  }, [uid]);

  // SAVE TO FIRESTORE
  async function save(updated) {
    setProgress(updated);
    await setDoc(
      doc(db, "users", uid),
      { progress: updated },
      { merge: true }
    );
  }

  function updateLesson(name, field, value) {
    const updated = {
      ...progress,
      [name]: {
        status: "todo",
        revisions: 0,
        pyqs: 0,
        ...progress[name],
        [field]: value,
      },
    };
    save(updated);
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">Dashboard – Class 9th</h1>

      {syllabus.Science.map((lesson) => {
        const data = progress[lesson.name] || {
          status: "todo",
          revisions: 0,
          pyqs: 0,
        };

        return (
          <div key={lesson.name} className="mb-6 p-4 bg-zinc-900 rounded">
            <h2 className="text-lg font-semibold">{lesson.name}</h2>

            {/* STATUS */}
            <div className="flex gap-2 mt-2">
              <button onClick={() => updateLesson(lesson.name, "status", "todo")} className="bg-gray-600 px-3 py-1 rounded">To Do</button>
              <button onClick={() => updateLesson(lesson.name, "status", "doing")} className="bg-yellow-600 px-3 py-1 rounded">Doing</button>
              <button onClick={() => updateLesson(lesson.name, "status", "done")} className="bg-green-600 px-3 py-1 rounded">Done</button>
              <button onClick={() => updateLesson(lesson.name, "status", "mastered")} className="bg-purple-600 px-3 py-1 rounded">Mastered</button>
            </div>

            {/* COUNTERS */}
            <div className="mt-2 text-sm">
              Revisions:
              <button onClick={() => updateLesson(lesson.name, "revisions", Math.max(0, data.revisions - 1))}> − </button>
              {data.revisions}
              <button onClick={() => updateLesson(lesson.name, "revisions", Math.min(100, data.revisions + 1))}> + </button>

              <br />

              PYQs:
              <button onClick={() => updateLesson(lesson.name, "pyqs", Math.max(0, data.pyqs - 1))}> − </button>
              {data.pyqs}
              <button onClick={() => updateLesson(lesson.name, "pyqs", Math.min(100, data.pyqs + 1))}> + </button>
            </div>

            {/* LINKS */}
            <div className="flex gap-4 mt-2 text-sm">
              <a href={lesson.video} target="_blank" className="text-blue-400">Lesson Video</a>
              {lesson.pyq && <a href={lesson.pyq} target="_blank" className="text-purple-400">PYQs</a>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

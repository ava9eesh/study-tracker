"use client";

import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { syllabus } from "../data/syllabus";

export default function Dashboard({ user }) {
  const uid = user.uid;

  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState({});
  const [openSubjects, setOpenSubjects] = useState({});

  /* -------------------- LOAD FROM FIRESTORE -------------------- */
  useEffect(() => {
    if (!uid) return;

    const load = async () => {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setData(snap.data().progress || {});
      } else {
        await setDoc(ref, {
          class: "9th",
          progress: {},
          createdAt: Date.now(),
        });
        setData({});
      }

      setLoaded(true);
    };

    load();
  }, [uid]);

  /* -------------------- SAVE TO FIRESTORE -------------------- */
  useEffect(() => {
    if (!loaded) return;

    const save = async () => {
      const ref = doc(db, "users", uid);
      await updateDoc(ref, { progress: data });
    };

    save();
  }, [data, loaded, uid]);

  /* -------------------- HELPERS -------------------- */
  const updateLesson = (subject, lesson, updates) => {
    setData((prev) => ({
      ...prev,
      [subject]: {
        ...(prev[subject] || {}),
        [lesson]: {
          status: "todo",
          revisions: 0,
          pyqs: 0,
          ...prev?.[subject]?.[lesson],
          ...updates,
        },
      },
    }));
  };

  const statusColor = {
    todo: "bg-gray-700",
    doing: "bg-yellow-500",
    done: "bg-green-600",
    mastered: "bg-purple-600",
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard – Class 9th</h1>

      {/* SEARCH */}
      <input
        className="w-full mb-6 p-3 rounded bg-zinc-900 outline-none"
        placeholder="Search lessons..."
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      {/* SUBJECTS */}
      {Object.entries(syllabus).map(([subject, lessons]) => {
        const lessonList = Array.isArray(lessons)
          ? lessons
          : Object.values(lessons).flat();

        const completed = lessonList.filter(
          (l) => data?.[subject]?.[l]?.status === "done" ||
                 data?.[subject]?.[l]?.status === "mastered"
        ).length;

        const progress = Math.round(
          (completed / lessonList.length) * 100
        );

        return (
          <div key={subject} className="mb-6 bg-zinc-900 rounded-xl p-4">
            {/* SUBJECT HEADER */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setOpenSubjects((o) => ({
                  ...o,
                  [subject]: !o[subject],
                }))
              }
            >
              <h2 className="text-xl font-semibold">{subject}</h2>
              <span>{progress}%</span>
            </div>

            {/* PROGRESS BAR */}
            <div className="h-2 bg-zinc-800 rounded mt-2">
              <div
                className="h-2 bg-blue-600 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* LESSONS */}
            {openSubjects[subject] &&
              lessonList
                .filter((l) => l.toLowerCase().includes(search))
                .map((lesson) => {
                  const info = data?.[subject]?.[lesson] || {};

                  return (
                    <div
                      key={lesson}
                      className="mt-4 p-4 bg-black rounded-lg border border-zinc-800"
                    >
                      <h3 className="font-semibold mb-2">{lesson}</h3>

                      {/* STATUS BUTTONS */}
                      <div className="flex gap-2 mb-3">
                        {["todo", "doing", "done", "mastered"].map((s) => (
                          <button
                            key={s}
                            onClick={() =>
                              updateLesson(subject, lesson, { status: s })
                            }
                            className={`px-3 py-1 rounded text-sm ${
                              info.status === s
                                ? statusColor[s]
                                : "bg-zinc-800"
                            }`}
                          >
                            {s.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      {/* REVISIONS */}
                      <div className="flex items-center gap-3 mb-2">
                        <span>Revisions</span>
                        <button
                          onClick={() =>
                            updateLesson(subject, lesson, {
                              revisions: Math.max(0, (info.revisions || 0) - 1),
                            })
                          }
                        >
                          -
                        </button>
                        <span>{info.revisions || 0}</span>
                        <button
                          onClick={() =>
                            updateLesson(subject, lesson, {
                              revisions: Math.min(100, (info.revisions || 0) + 1),
                            })
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* PYQS */}
                      <div className="flex items-center gap-3 mb-2">
                        <span>PYQs</span>
                        <button
                          onClick={() =>
                            updateLesson(subject, lesson, {
                              pyqs: Math.max(0, (info.pyqs || 0) - 1),
                            })
                          }
                        >
                          -
                        </button>
                        <span>{info.pyqs || 0}</span>
                        <button
                          onClick={() =>
                            updateLesson(subject, lesson, {
                              pyqs: Math.min(100, (info.pyqs || 0) + 1),
                            })
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* LINKS */}
                      <div className="flex gap-4 text-blue-400 text-sm">
                        <a href="#" target="_blank">Lesson Video</a>
                        <a href="#" target="_blank">PYQs</a>
                      </div>
                    </div>
                  );
                })}
          </div>
        );
      })}
    </div>
  );
}

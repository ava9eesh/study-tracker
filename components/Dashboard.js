"use client";

import { useEffect, useState } from "react";
import { syllabus } from "@/data/syllabus9";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";

const STATUS_COLORS = {
  todo: "bg-zinc-700",
  doing: "bg-yellow-500",
  done: "bg-green-600",
  mastered: "bg-purple-600",
};

const STATUSES = ["todo", "doing", "done", "mastered"];

export default function Dashboard({ user, selectedClass }) {
  const [data, setData] = useState({});
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState({});

  /* ---------------- FIRESTORE LOAD ---------------- */
  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().progress) {
        setData(snap.data().progress);
      }
    };
    load();
  }, [user.uid]);

  /* ---------------- FIRESTORE SAVE ---------------- */
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    setDoc(
      ref,
      {
        class: selectedClass,
        progress: data,
      },
      { merge: true }
    );
  }, [data, user, selectedClass]);

  /* ---------------- HELPERS ---------------- */
  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateLesson = (subject, lesson, changes) => {
    setData((prev) => ({
      ...prev,
      [subject]: {
        ...(prev[subject] || {}),
        [lesson]: {
          status: "todo",
          revisions: 0,
          pyqs: 0,
          video: "",
          pyqsLink: "",
          ...(prev[subject]?.[lesson] || {}),
          ...changes,
        },
      },
    }));
  };

  /* ---------------- PROGRESS ---------------- */
  const allLessons = Object.values(syllabus)
    .flatMap((s) =>
      Array.isArray(s) ? s : Object.values(s).flat()
    );

  const completed = Object.values(data)
    .flatMap((s) => Object.values(s))
    .filter(
      (l) => l.status === "done" || l.status === "mastered"
    ).length;

  const percent = allLessons.length
    ? Math.round((completed / allLessons.length) * 100)
    : 0;

  /* ---------------- RENDER LESSON ---------------- */
  const renderLesson = (subject, lesson) => {
    if (!lesson.toLowerCase().includes(search.toLowerCase())) return null;

    const l = data?.[subject]?.[lesson] || { status: "todo" };

    return (
      <div
        key={lesson}
        className={`p-3 rounded mb-2 ${STATUS_COLORS[l.status]}`}
      >
        <div className="font-semibold mb-2">{lesson}</div>

        {/* STATUS */}
        <div className="flex gap-2 mb-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => updateLesson(subject, lesson, { status: s })}
              className={`px-2 py-1 text-xs rounded ${
                l.status === s ? "ring-2 ring-white" : ""
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        {/* COUNTERS */}
        <div className="flex gap-4 text-sm mb-2">
          <label>
            Revisions:
            <input
              type="number"
              min="0"
              max="100"
              value={l.revisions}
              onChange={(e) =>
                updateLesson(subject, lesson, {
                  revisions: Number(e.target.value),
                })
              }
              className="ml-2 w-16 bg-black rounded px-1"
            />
          </label>

          <label>
            PYQs:
            <input
              type="number"
              min="0"
              max="100"
              value={l.pyqs}
              onChange={(e) =>
                updateLesson(subject, lesson, {
                  pyqs: Number(e.target.value),
                })
              }
              className="ml-2 w-16 bg-black rounded px-1"
            />
          </label>
        </div>

        {/* LINKS */}
        <input
          placeholder="Lesson video link"
          value={l.video}
          onChange={(e) =>
            updateLesson(subject, lesson, { video: e.target.value })
          }
          className="w-full mb-1 bg-black p-1 rounded text-sm"
        />

        <input
          placeholder="PYQs link"
          value={l.pyqsLink}
          onChange={(e) =>
            updateLesson(subject, lesson, { pyqsLink: e.target.value })
          }
          className="w-full bg-black p-1 rounded text-sm"
        />
      </div>
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">
          Class {selectedClass} Dashboard
        </h1>
        <button
          onClick={() => signOut(auth)}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search lessons..."
        className="w-full mb-4 p-2 rounded bg-zinc-900"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* PROGRESS */}
      <div className="mb-6">
        <div className="flex justify-between text-sm">
          <span>Overall Progress</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-blue-500 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* SYLLABUS */}
      {Object.entries(syllabus).map(([subject, content]) => (
        <div key={subject} className="mb-6">
          <button
            onClick={() => toggle(subject)}
            className="text-2xl font-semibold mb-2"
          >
            {subject} {open[subject] ? "▾" : "▸"}
          </button>

          {open[subject] &&
            (Array.isArray(content)
              ? content.map((l) => renderLesson(subject, l))
              : Object.entries(content).map(([sub, lessons]) => (
                  <div key={sub} className="ml-4">
                    <button
                      onClick={() => toggle(subject + sub)}
                      className="text-lg mb-1"
                    >
                      {sub} {open[subject + sub] ? "▾" : "▸"}
                    </button>
                    {open[subject + sub] &&
                      lessons.map((l) => renderLesson(subject, l))}
                  </div>
                )))}
        </div>
      ))}
    </div>
  );
}

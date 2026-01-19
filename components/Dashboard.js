"use client";

import { syllabus9 } from "../data/syllabus9";
import { getProgress, saveProgress } from "../utils/storage";
import LessonCard from "./LessonCard";
import { useEffect, useState } from "react";

export default function Dashboard({ user }) {
  const STORAGE_KEY = `progress_9_${user.uid}`;

  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    setProgress(getProgress(STORAGE_KEY));
  }, []);

  const updateLesson = (subject, lesson, data) => {
    const updated = {
      ...progress,
      [subject]: {
        ...(progress[subject] || {}),
        [lesson]: data,
      },
    };

    setProgress(updated);
    saveProgress(STORAGE_KEY, updated);
  };

  const totalLessons = Object.values(syllabus9).flat().length;
  const completed = Object.values(progress)
    .flatMap((s) => Object.values(s || {}))
    .filter((l) => l?.status === "done" || l?.status === "mastered").length;

  const percent = Math.round((completed / totalLessons) * 100) || 0;

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.displayName}</h1>

      {/* Search */}
      <input
        placeholder="Search lessons..."
        className="w-full p-3 rounded bg-zinc-800 outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Progress */}
      <div className="bg-zinc-900 p-4 rounded">
        <p className="text-sm text-zinc-400">Overall Progress</p>
        <p className="text-2xl font-bold">{percent}%</p>
        <div className="w-full h-2 bg-zinc-800 rounded mt-2">
          <div
            className="h-2 bg-green-500 rounded"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Subjects */}
      {Object.entries(syllabus9).map(([subject, lessons]) => (
        <div key={subject} className="bg-zinc-900 p-4 rounded space-y-2">
          <h2 className="text-xl font-semibold">{subject}</h2>

          {lessons
            .filter((l) =>
              l.toLowerCase().includes(search.toLowerCase())
            )
            .map((lesson) => (
              <LessonCard
                key={lesson}
                lesson={lesson}
                data={progress?.[subject]?.[lesson]}
                onChange={(data) =>
                  updateLesson(subject, lesson, data)
                }
              />
            ))}
        </div>
      ))}
    </div>
  );
}

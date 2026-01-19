"use client";

import { syllabus9 } from "../data/syllabus9";
import { getProgress, saveProgress } from "../utils/storage";
import LessonCard from "./LessonCard";
import { useEffect, useState } from "react";

export default function Dashboard({ user }) {
  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    setProgress(getProgress(user.uid));
  }, [user.uid]);

  const updateLesson = (subject, lesson, data) => {
    const updated = {
      ...progress,
      [subject]: {
        ...(progress[subject] || {}),
        [lesson]: data
      }
    };
    setProgress(updated);
    saveProgress(user.uid, updated);
  };

  const totalLessons = Object.values(syllabus9).flat().length;
  const completed = Object.values(progress)
    .flatMap(o => Object.values(o))
    .filter(l => l.status === "done" || l.status === "mastered").length;

  const percent = Math.round((completed / totalLessons) * 100);

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl mb-4">Welcome, {user.displayName}</h1>

      {/* SEARCH */}
      <input
        className="w-full p-2 bg-zinc-900 mb-4"
        placeholder="Search lessons..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* PROGRESS */}
      <div className="mb-6">
        <div className="h-2 bg-zinc-800 rounded">
          <div className="h-full bg-green-500" style={{ width: `${percent}%` }} />
        </div>
        <p className="text-sm mt-1">{percent}% completed</p>
      </div>

      {/* SUBJECTS */}
      {Object.entries(syllabus9).map(([subject, lessons]) => (
        <div key={subject} className="mb-6">
          <h2 className="text-xl mb-2">{subject}</h2>
          {lessons
            .filter(l => l.toLowerCase().includes(search.toLowerCase()))
            .map(lesson => (
              <LessonCard
                key={lesson}
                lesson={lesson}
                data={
                  progress[subject]?.[lesson] || {
                    status: "todo",
                    revisions: 0,
                    pyqs: 0,
                    links: { video: "", pyqs: "" }
                  }
                }
                onChange={data => updateLesson(subject, lesson, data)}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

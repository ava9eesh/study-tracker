"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";
import { getProgress, saveProgress } from "../utils/storage";
import { getStreak, updateStreak } from "../utils/streak";

export default function Dashboard({ user }) {
  const [progress, setProgress] = useState({});
  const [streak, setStreak] = useState({ count: 0 });
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    setProgress(getProgress(user));
    setStreak(getStreak(user));
  }, [user]);

  const cycleStatus = (key, lesson) => {
    const updated = { ...progress };
    updated[key] ??= {};

    const current = updated[key][lesson] || "todo";
    const next =
      current === "todo"
        ? "doing"
        : current === "doing"
        ? "done"
        : "todo";

    updated[key][lesson] = next;
    setProgress(updated);
    saveProgress(user, updated);

    setStreak(updateStreak(user));
  };

  const statusColor = (status) =>
    status === "done"
      ? "bg-green-700/50"
      : status === "doing"
      ? "bg-yellow-600/40"
      : "bg-red-600/30";

  const overallProgress = () => {
    let total = 0;
    let done = 0;

    Object.entries(syllabus).forEach(([subject, content]) => {
      if (Array.isArray(content)) {
        total += content.length;
        done += Object.values(progress[subject] || {}).filter(
          (v) => v === "done"
        ).length;
      } else {
        Object.entries(content).forEach(([section, lessons]) => {
          const key = `${subject}-${section}`;
          total += lessons.length;
          done += Object.values(progress[key] || {}).filter(
            (v) => v === "done"
          ).length;
        });
      }
    });

    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const toggleCollapse = (subject) => {
    setCollapsed((prev) => ({
      ...prev,
      [subject]: !prev[subject],
    }));
  };

  const matchesSearch = (text) =>
    text.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Welcome, {user}
        </h1>

        {/* SEARCH */}
        <input
          className="w-full mb-8 p-3 rounded-lg bg-zinc-900 outline-none"
          placeholder="Search lessons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="glass p-5 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">
              Overall Progress
            </p>
            <p className="font-semibold mb-2">
              {overallProgress()}%
            </p>
            <div className="h-2 bg-zinc-800 rounded">
              <div
                className="h-full bg-green-500 rounded"
                style={{ width: `${overallProgress()}%` }}
              />
            </div>
          </div>

          <div className="glass p-5 rounded-xl">
            <p className="text-sm text-gray-400">
              Daily Streak
            </p>
            <h2 className="text-2xl font-bold">
              🔥 {streak.count} days
            </h2>
          </div>
        </div>

        {/* SUBJECTS */}
        {Object.entries(syllabus).map(([subject, content]) => (
          <div key={subject} className="glass p-6 rounded-2xl mb-12">

            {/* SUBJECT HEADER */}
            <div
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleCollapse(subject)}
            >
              <h2 className="text-2xl font-semibold">
                {subject}
              </h2>
              <span className="text-xl">
                {collapsed[subject] ? "➕" : "➖"}
              </span>
            </div>

            {!collapsed[subject] && (
              <>
                {Array.isArray(content)
                  ? content
                      .filter((lesson) =>
                        matchesSearch(lesson)
                      )
                      .map((lesson) => {
                        const status =
                          progress[subject]?.[lesson] || "todo";
                        return (
                          <div
                            key={lesson}
                            onClick={() =>
                              cycleStatus(subject, lesson)
                            }
                            className={`p-3 mb-2 rounded-lg cursor-pointer transition ${statusColor(
                              status
                            )}`}
                          >
                            {lesson}
                          </div>
                        );
                      })
                  : Object.entries(content).map(
                      ([section, lessons]) => {
                        const key = `${subject}-${section}`;

                        const filtered = lessons.filter((l) =>
                          matchesSearch(l)
                        );

                        if (filtered.length === 0) return null;

                        return (
                          <div key={section} className="mb-6">
                            <h3 className="font-medium mb-2">
                              {section}
                            </h3>

                            {filtered.map((lesson) => {
                              const status =
                                progress[key]?.[lesson] ||
                                "todo";
                              return (
                                <div
                                  key={lesson}
                                  onClick={() =>
                                    cycleStatus(key, lesson)
                                  }
                                  className={`p-3 mb-2 rounded-lg cursor-pointer transition ${statusColor(
                                    status
                                  )}`}
                                >
                                  {lesson}
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                    )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

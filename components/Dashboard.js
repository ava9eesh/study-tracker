"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";
import { getProgress, saveProgress } from "../utils/storage";
import { getStreak, updateStreak } from "../utils/streak";
import { db } from "../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Dashboard({ user, name }) {
  const [progress, setProgress] = useState({});
  const [streak, setStreak] = useState({ count: 0 });
  const [analytics, setAnalytics] = useState({
    totalDone: 0,
    todayDone: 0,
  });
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState({});

  /* ---------- HELPERS ---------- */
  const statusColor = (status) => {
    if (status === "done") return "bg-green-700/50";
    if (status === "doing") return "bg-yellow-600/40";
    return "bg-red-600/30";
  };

  const matchesSearch = (text) =>
    text.toLowerCase().includes(search.toLowerCase());

  /* ---------- ANALYTICS (RECOMPUTE = TRUTH) ---------- */
  const recomputeAnalytics = async (updatedProgress) => {
    let totalDone = 0;
    const today = new Date().toDateString();

    Object.values(updatedProgress).forEach((lessons) => {
      Object.values(lessons).forEach((status) => {
        if (status === "done") totalDone += 1;
      });
    });

    const ref = doc(db, "analytics", user);
    const snap = await getDoc(ref);

    let todayDone = totalDone;
    if (snap.exists() && snap.data().lastDay === today) {
      todayDone = snap.data().todayDone;
    }

    const data = {
      totalDone,
      todayDone,
      lastDay: today,
    };

    await setDoc(ref, data);
    setAnalytics(data);
  };

  /* ---------- LOAD ON LOGIN ---------- */
  useEffect(() => {
    const stored = getProgress(user);
    setProgress(stored);
    setStreak(getStreak(user));
    recomputeAnalytics(stored);
  }, [user]);

  /* ---------- STATUS CYCLE ---------- */
  const cycleStatus = async (key, lesson) => {
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

    await recomputeAnalytics(updated);
    setStreak(updateStreak(user));
  };

  /* ---------- OVERALL PROGRESS ---------- */
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

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          Welcome{ name ? `, ${name}` : "" }
        </h1>

        {/* SEARCH */}
        <input
          className="w-full mb-8 p-3 rounded-lg bg-zinc-900 outline-none"
          placeholder="Search lessons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass p-5 rounded-xl">
            <p className="text-sm text-gray-400">Overall Progress</p>
            <p className="text-xl font-bold">{overallProgress()}%</p>
            <div className="h-2 bg-zinc-800 rounded mt-2">
              <div
                className="h-full bg-green-500 rounded"
                style={{ width: `${overallProgress()}%` }}
              />
            </div>
          </div>

          <div className="glass p-5 rounded-xl">
            <p className="text-sm text-gray-400">Daily Streak</p>
            <p className="text-2xl font-bold">
              🔥 {streak.count} days
            </p>
          </div>

          <div className="glass p-5 rounded-xl">
            <p className="text-sm text-gray-400">Analytics</p>
            <p>Total finished: {analytics.totalDone}</p>
            <p>Finished today: {analytics.todayDone}</p>
          </div>
        </div>

        {/* SUBJECTS */}
        {Object.entries(syllabus).map(([subject, content]) => (
          <div key={subject} className="glass p-6 rounded-2xl mb-12">

            <div
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleCollapse(subject)}
            >
              <h2 className="text-2xl font-semibold">{subject}</h2>
              <span className="text-xl">
                {collapsed[subject] ? "➕" : "➖"}
              </span>
            </div>

            {!collapsed[subject] && (
              <>
                {Array.isArray(content)
                  ? content
                      .filter(matchesSearch)
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
                        const filtered = lessons.filter(matchesSearch);
                        if (!filtered.length) return null;

                        return (
                          <div key={section} className="mb-6">
                            <h3 className="font-medium mb-2">
                              {section}
                            </h3>
                            {filtered.map((lesson) => {
                              const status =
                                progress[key]?.[lesson] || "todo";
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

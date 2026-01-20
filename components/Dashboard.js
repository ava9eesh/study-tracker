"use client";

import { useState } from "react";
import { syllabus } from "../data/syllabus";

const STATUS_COLORS = {
  todo: "",
  doing: "bg-yellow-500/20 text-yellow-400",
  done: "bg-green-500/20 text-green-400",
  mastered: "bg-purple-500/20 text-purple-400",
};

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState({});
  const [lessonData, setLessonData] = useState({});

  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateLesson = (lesson, patch) => {
    setLessonData((prev) => ({
      ...prev,
      [lesson]: {
        status: "todo",
        revisions: 0,
        pyqs: 0,
        ...prev[lesson],
        ...patch,
      },
    }));
  };

  const renderLesson = (lesson) => {
    if (
      search &&
      !lesson.toLowerCase().includes(search.toLowerCase())
    )
      return null;

    const data = lessonData[lesson] || {
      status: "todo",
      revisions: 0,
      pyqs: 0,
    };

    const key = `lesson-${lesson}`;

    return (
      <div key={lesson} className="ml-6 mt-3 rounded-xl bg-zinc-900 p-4">
        <button
          onClick={() => toggle(key)}
          className="w-full text-left font-medium"
        >
          {lesson}
        </button>

        {open[key] && (
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex gap-2 flex-wrap">
              {["todo", "doing", "done", "mastered"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateLesson(lesson, { status: s })}
                  className={`px-3 py-1 rounded ${
                    data.status === s
                      ? STATUS_COLORS[s]
                      : "bg-zinc-800"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex gap-6">
              <button
                onClick={() =>
                  updateLesson(lesson, {
                    revisions: data.revisions + 1,
                  })
                }
                className="text-blue-400"
              >
                Revisions: {data.revisions} +
              </button>

              <button
                onClick={() =>
                  updateLesson(lesson, {
                    pyqs: data.pyqs + 1,
                  })
                }
                className="text-pink-400"
              >
                PYQs: {data.pyqs} +
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSubject = (subjectName, subjectData) => {
    const key = `subject-${subjectName}`;

    return (
      <div key={subjectName} className="rounded-2xl bg-zinc-900 p-5">
        <button
          onClick={() => toggle(key)}
          className="w-full text-left text-lg font-semibold"
        >
          {subjectName}
        </button>

        {open[key] && (
          <div className="mt-4">
            {Array.isArray(subjectData) &&
              subjectData.map(renderLesson)}

            {!Array.isArray(subjectData) &&
              Object.entries(subjectData).map(
                ([subName, lessons]) => (
                  <div key={subName} className="ml-4 mt-4">
                    <div className="font-medium text-gray-300">
                      {subName}
                    </div>
                    {lessons.map(renderLesson)}
                  </div>
                )
              )}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Dashboard – Class 9
        </h1>
        <button className="text-red-500">Logout</button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search lessons..."
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none"
      />

      {Object.entries(syllabus).map(([name, data]) =>
        renderSubject(name, data)
      )}
    </main>
  );
}

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
  const [openSubjects, setOpenSubjects] = useState({});
  const [openLessons, setOpenLessons] = useState({});
  const [data, setData] = useState({});

  const toggleSubject = (key) =>
    setOpenSubjects((p) => ({ ...p, [key]: !p[key] }));

  const toggleLesson = (key) =>
    setOpenLessons((p) => ({ ...p, [key]: !p[key] }));

  const updateLesson = (lesson, patch) => {
    setData((p) => ({
      ...p,
      [lesson]: {
        status: "todo",
        revisions: 0,
        pyqs: 0,
        ...p[lesson],
        ...patch,
      },
    }));
  };

  const renderLesson = (lesson) => {
    const l = data[lesson] || { status: "todo", revisions: 0, pyqs: 0 };
    const key = `lesson-${lesson}`;

    if (
      search &&
      typeof lesson === "string" &&
      !lesson.toLowerCase().includes(search.toLowerCase())
    )
      return null;

    return (
      <div key={lesson} className="ml-6 mt-3 rounded-xl bg-zinc-900 p-4">
        <button
          onClick={() => toggleLesson(key)}
          className="w-full text-left font-medium"
        >
          {lesson}
        </button>

        {openLessons[key] && (
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex gap-2">
              {["todo", "doing", "done", "mastered"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateLesson(lesson, { status: s })}
                  className={`px-3 py-1 rounded ${
                    l.status === s ? STATUS_COLORS[s] : "bg-zinc-800"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex gap-6">
              <button
                onClick={() =>
                  updateLesson(lesson, { revisions: l.revisions + 1 })
                }
                className="text-blue-400"
              >
                Revisions: {l.revisions} +
              </button>

              <button
                onClick={() => updateLesson(lesson, { pyqs: l.pyqs + 1 })}
                className="text-pink-400"
              >
                PYQs: {l.pyqs} +
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBlock = (title, items) => {
    const key = `subject-${title}`;

    return (
      <div className="rounded-2xl bg-zinc-900 p-5">
        <button
          onClick={() => toggleSubject(key)}
          className="w-full text-left text-lg font-semibold"
        >
          {title}
        </button>

        {openSubjects[key] &&
          items.map((lesson) => renderLesson(lesson))}
      </div>
    );
  };

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard – Class 9</h1>
        <button className="text-red-500">Logout</button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search lessons..."
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 outline-none"
      />

      {renderBlock("Science", syllabus.Science)}
      {renderBlock("Mathematics", syllabus.Mathematics)}

      <div className="rounded-2xl bg-zinc-900 p-5">
        <button
          onClick={() => toggleSubject("sst")}
          className="w-full text-left text-lg font-semibold"
        >
          SST
        </button>

        {openSubjects.sst &&
          Object.entries(syllabus.SST).map(([k, v]) => (
            <div key={k} className="ml-4 mt-3">
              <div className="font-medium">{k}</div>
              {v.map((l) => renderLesson(l))}
            </div>
          ))}
      </div>

      <div className="rounded-2xl bg-zinc-900 p-5">
        <button
          onClick={() => toggleSubject("english")}
          className="w-full text-left text-lg font-semibold"
        >
          English
        </button>

        {openSubjects.english &&
          Object.entries(syllabus.English).map(([k, v]) => (
            <div key={k} className="ml-4 mt-3">
              <div className="font-medium">{k}</div>
              {v.map((l) => renderLesson(l))}
            </div>
          ))}
      </div>

      <div className="rounded-2xl bg-zinc-900 p-5">
        <button
          onClick={() => toggleSubject("hindi")}
          className="w-full text-left text-lg font-semibold"
        >
          Hindi
        </button>

        {openSubjects.hindi &&
          Object.entries(syllabus.Hindi).map(([k, v]) => (
            <div key={k} className="ml-4 mt-3">
              <div className="font-medium">{k}</div>
              {v.map((l) => renderLesson(l))}
            </div>
          ))}
      </div>
    </main>
  );
}

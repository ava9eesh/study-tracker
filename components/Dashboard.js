"use client";

import { useEffect, useState } from "react";

/* -----------------------------
   BASIC 9TH SYLLABUS (SAFE)
------------------------------ */
const SYLLABUS = {
  Science: [
    "Matter in Our Surroundings",
    "Is Matter Around Us Pure?",
    "Atoms and Molecules",
    "Structure of the Atom",
    "The Fundamental Unit of Life",
    "Tissues",
    "Motion",
    "Force and Laws of Motion",
    "Gravitation",
    "Work and Energy",
    "Sound",
    "Improvement in Food Resources",
  ],
  Mathematics: [
    "Number Systems",
    "Polynomials",
    "Coordinate Geometry",
    "Linear Equations in Two Variables",
    "Lines and Angles",
    "Triangles",
    "Quadrilaterals",
    "Circles",
    "Statistics",
  ],
  SST: [
    "The French Revolution",
    "What is Democracy?",
    "India – Size and Location",
    "The Story of Village Palampur",
  ],
  English: [
    "The Fun They Had",
    "The Sound of Music",
    "The Little Girl",
  ],
  Hindi: [
    "Dukh Ka Adhikar",
    "Everest: Meri Shikhar Yatra",
  ],
};

/* -----------------------------
   HELPERS
------------------------------ */
const emptyLesson = {
  status: "todo", // todo | doing | done | mastered
  revisions: 0,
  pyqs: 0,
};

/* -----------------------------
   DASHBOARD
------------------------------ */
export default function Dashboard() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [collapsedSubjects, setCollapsedSubjects] = useState({});
  const [collapsedLessons, setCollapsedLessons] = useState({});
  const [data, setData] = useState({});

  /* LOAD SAVED DATA */
  useEffect(() => {
    const saved = localStorage.getItem("study-data");
    if (saved) setData(JSON.parse(saved));
  }, []);

  /* SAVE HANDLER */
  const saveProgress = () => {
    localStorage.setItem("study-data", JSON.stringify(data));
    alert("Progress saved 💾");
  };

  /* CLASS SELECTOR */
  if (!selectedClass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="glass p-6 rounded-xl w-[320px]">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Select your class
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedClass("9th")}
              className="bg-blue-600 py-2 rounded-lg"
            >
              9th
            </button>

            {["10th", "11th", "12th", "JEE/NEET"].map((c) => (
              <button
                key={c}
                disabled
                className="bg-gray-700 opacity-60 py-2 rounded-lg cursor-not-allowed"
              >
                {c} 🚧
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* PROGRESS CALC */
  const allLessons = Object.values(SYLLABUS).flat();
  const completed = allLessons.filter(
    (l) => data[l]?.status === "done" || data[l]?.status === "mastered"
  ).length;
  const progress = Math.round((completed / allLessons.length) * 100);

  /* -----------------------------
     RENDER
  ------------------------------ */
  return (
    <div className="min-h-screen bg-black text-white px-8 py-6">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Dashboard — Class {selectedClass}
        </h1>

        <button
          onClick={() => setSelectedClass(null)}
          className="text-red-400 hover:text-red-500"
        >
          Logout
        </button>
      </div>

      {/* SAVE + PROGRESS */}
      <div className="mb-6">
        <button
          onClick={saveProgress}
          className="bg-green-600 px-4 py-2 rounded-lg mb-3"
        >
          Save Progress
        </button>

        <div className="text-sm mb-1">Overall Progress — {progress}%</div>
        <div className="h-2 bg-gray-800 rounded">
          <div
            className="h-2 bg-blue-500 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* SUBJECTS */}
      <div className="space-y-4">
        {Object.entries(SYLLABUS).map(([subject, lessons]) => (
          <div key={subject} className="glass rounded-xl">
            {/* SUBJECT HEADER */}
            <button
              onClick={() =>
                setCollapsedSubjects((p) => ({
                  ...p,
                  [subject]: !p[subject],
                }))
              }
              className="w-full flex justify-between items-center px-5 py-4 text-lg font-medium"
            >
              {subject}
              <span>{collapsedSubjects[subject] ? "▶" : "▼"}</span>
            </button>

            {/* LESSONS */}
            {!collapsedSubjects[subject] && (
              <div className="px-5 pb-4 space-y-3">
                {lessons.map((lesson) => {
                  const ldata = data[lesson] || emptyLesson;

                  return (
                    <div key={lesson} className="bg-black/40 p-4 rounded-lg">
                      {/* LESSON HEADER */}
                      <button
                        onClick={() =>
                          setCollapsedLessons((p) => ({
                            ...p,
                            [lesson]: !p[lesson],
                          }))
                        }
                        className="w-full flex justify-between items-center text-left"
                      >
                        <span>{lesson}</span>
                        <span className="text-sm">
                          {collapsedLessons[lesson] ? "▶" : "▼"}
                        </span>
                      </button>

                      {/* LESSON BODY */}
                      {!collapsedLessons[lesson] && (
                        <div className="mt-3 space-y-3 text-sm">
                          {/* STATUS */}
                          <div className="flex gap-2">
                            {["todo", "doing", "done", "mastered"].map(
                              (s) => (
                                <button
                                  key={s}
                                  onClick={() =>
                                    setData((p) => ({
                                      ...p,
                                      [lesson]: {
                                        ...ldata,
                                        status: s,
                                      },
                                    }))
                                  }
                                  className={`px-3 py-1 rounded ${
                                    ldata.status === s
                                      ? s === "doing"
                                        ? "bg-yellow-500"
                                        : s === "done"
                                        ? "bg-green-600"
                                        : s === "mastered"
                                        ? "bg-purple-600"
                                        : "bg-gray-600"
                                      : "bg-gray-700"
                                  }`}
                                >
                                  {s.toUpperCase()}
                                </button>
                              )
                            )}
                          </div>

                          {/* REVISIONS / PYQS */}
                          <div className="flex gap-6">
                            <div>
                              Revisions: {ldata.revisions}
                              <button
                                onClick={() =>
                                  setData((p) => ({
                                    ...p,
                                    [lesson]: {
                                      ...ldata,
                                      revisions: ldata.revisions + 1,
                                    },
                                  }))
                                }
                                className="ml-2 px-2 bg-gray-700 rounded"
                              >
                                +
                              </button>
                            </div>

                            <div>
                              PYQs: {ldata.pyqs}
                              <button
                                onClick={() =>
                                  setData((p) => ({
                                    ...p,
                                    [lesson]: {
                                      ...ldata,
                                      pyqs: ldata.pyqs + 1,
                                    },
                                  }))
                                }
                                className="ml-2 px-2 bg-gray-700 rounded"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

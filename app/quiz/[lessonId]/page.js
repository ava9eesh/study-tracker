"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { questions as QUESTION_BANK } from "@/data/questions";

export default function QuizPage({ params }) {
  const lessonId = params?.lessonId;
  const searchParams = useSearchParams();
  const marks = Number(searchParams.get("marks")) || 40;

  const lessonQuestions =
    QUESTION_BANK?.[lessonId]?.[marks === 80 ? "mcq80" : "mcq40"] ?? [];

  // 🛑 IMPORTANT GUARD (prevents crash)
  if (!lessonQuestions.length) {
    return (
      <main className="max-w-xl mx-auto p-6 text-white text-center">
        <h1 className="text-xl font-bold mb-2">
          No questions added yet 😭
        </h1>
        <p className="text-gray-400">
          Add questions for this lesson in <code>data/questions.js</code>
        </p>
      </main>
    );
  }

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = lessonQuestions[index];

  const answer = (i) => {
    if (i === current.correct) {
      setScore((s) => s + 1);
    }

    if (index + 1 === lessonQuestions.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (finished) {
    return (
      <main className="max-w-xl mx-auto p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-4">
          Quiz Completed 🎉
        </h1>
        <p className="text-lg">
          Score: {score} / {lessonQuestions.length}
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6 text-white">
      <h2 className="mb-4 font-semibold">
        {current.question}
      </h2>

      <div className="space-y-2">
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(i)}
            className="block w-full bg-zinc-800 p-2 rounded hover:bg-zinc-700"
          >
            {opt}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-400">
        Question {index + 1} / {lessonQuestions.length}
      </p>
    </main>
  );
}

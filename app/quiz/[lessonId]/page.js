"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState } from "react";
import { questions as QUESTION_BANK } from "../../../data/questions";

export default function QuizPage() {
  const { lessonId } = useParams(); // ✅ THIS IS THE FIX
  const searchParams = useSearchParams();
  const marks = Number(searchParams.get("marks")) || 40;

  const mode = marks === 80 ? "mcq80" : "mcq40";
  const lessonBlock = QUESTION_BANK[lessonId];

  // 🔍 DEBUG (keep once, then remove later)
  console.log("lessonId:", lessonId);
  console.log("QUESTION_BANK keys:", Object.keys(QUESTION_BANK));
  console.log("lessonBlock:", lessonBlock);

  if (!lessonBlock || !lessonBlock[mode]) {
    return (
      <main className="max-w-xl mx-auto p-6 text-white text-center">
        <h1 className="text-xl font-bold mb-2">
          Quiz data not found
        </h1>
        <p className="text-gray-400">
          lessonId: <code>{lessonId}</code>
        </p>
      </main>
    );
  }

  const questions = lessonBlock[mode];

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];

  const answer = (i) => {
    if (i === current.correct) setScore((s) => s + 1);
    if (index + 1 === questions.length) setFinished(true);
    else setIndex((i) => i + 1);
  };

  if (finished) {
    return (
      <main className="max-w-xl mx-auto p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-4">
          Quiz Completed 🎉
        </h1>
        <p>
          Score: {score} / {questions.length}
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
        Question {index + 1} / {questions.length}
      </p>
    </main>
  );
}

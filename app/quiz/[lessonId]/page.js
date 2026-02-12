"use client";

import { questions as QUESTION_BANK } from "@/data/questions";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function QuizPage({ params }) {
  const { lessonId } = params;
  const searchParams = useSearchParams();
  const marks = Number(searchParams.get("marks")) || 40;

  const totalQuestions = marks === 80 ? 40 : 20;

const lessonQuestions =
  QUESTION_BANK[lessonId]?.[marks === 80 ? "mcq80" : "mcq40"] ?? [];

const questions = lessonQuestions;


  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const answer = (i) => {
    if (i === questions[index].correct) {
      setScore(score + 1);
    }

    if (index + 1 === questions.length) {
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
  };

  if (finished) {
    return (
      <main className="max-w-xl mx-auto p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-4">
          Quiz Completed 🎉
        </h1>
        <p className="text-lg">
          Score: {score} / {questions.length}
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6 text-white">
      <h2 className="mb-4 font-semibold">
        {questions[index].question}
      </h2>

      <div className="space-y-2">
        {questions[index].options.map((opt, i) => (
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

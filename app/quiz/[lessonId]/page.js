"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState } from "react";
import { questions as QUESTION_BANK } from "../../../data/questions";

export default function QuizPage() {
  const { lessonId } = useParams();
  const searchParams = useSearchParams();
  const marks = Number(searchParams.get("marks")) || 40;

  const mode = marks === 80 ? "mcq80" : "mcq40";
  const lessonBlock = QUESTION_BANK[lessonId];

  if (!lessonBlock || !lessonBlock[mode]) {
    return (
      <main className="max-w-xl mx-auto p-6 text-white text-center">
        <h1 className="text-xl font-bold">Quiz data not found</h1>
        <p className="text-gray-400">Lesson: {lessonId}</p>
      </main>
    );
  }

  const questions = lessonBlock[mode];

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]); // 🆕 store user answers

  const current = questions[index];

  const answer = (selected) => {
    setAnswers((prev) => [...prev, selected]);

    if (selected === current.correct) {
      setScore((s) => s + 1);
    }

    if (index + 1 === questions.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  /* -------------------- RESULT + REVIEW -------------------- */
  if (finished) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">
          Quiz Completed 🎉
        </h1>

        <p className="mb-6 text-lg">
          Score: <b>{score}</b> / {questions.length}
        </p>

        <h2 className="text-xl font-semibold mb-3">
          Answer Review
        </h2>

        <div className="space-y-4">
          {questions.map((q, i) => {
            const userAns = answers[i];
            const correctAns = q.correct;

            return (
              <div
                key={i}
                className="bg-zinc-900 p-4 rounded"
              >
                <p className="font-medium mb-2">
                  Q{i + 1}. {q.question}
                </p>

                <ul className="space-y-1">
                  {q.options.map((opt, idx) => {
                    let color = "text-gray-300";

                    if (idx === correctAns) {
                      color = "text-green-400";
                    }
                    if (
                      idx === userAns &&
                      userAns !== correctAns
                    ) {
                      color = "text-red-400";
                    }

                    return (
                      <li key={idx} className={color}>
                        {opt}
                        {idx === correctAns && " ✔"}
                        {idx === userAns &&
                          userAns !== correctAns &&
                          " ✖"}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </main>
    );
  }

  /* -------------------- QUIZ UI -------------------- */
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

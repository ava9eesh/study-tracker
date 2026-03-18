"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState } from "react";
import { questions } from "@/data/questions";
import { useMemo } from "react";

console.log("SHUFFLE:", shouldShuffle);

// 🔥 SHUFFLE FUNCTION
function shuffleQuestion(question) {
  const options = question.options.map((opt, index) => ({
    text: opt,
    isCorrect: index === question.correct,
  }));

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    ...question,
    options: options.map((o) => o.text),
    correct: options.findIndex((o) => o.isCorrect),
  };
}

export default function QuizPage() {
  const params = useParams();
  const search = useSearchParams();

  const lesson = params.lesson;
  const marks = search.get("marks") || "40";
  const shouldShuffle = search.get("shuffle") === "1";

  const rawQuestions =
    questions[lesson]?.[`mcq${marks}`] || [];

const quizQuestions = useMemo(() => {
  if (!shouldShuffle) return rawQuestions;
  return rawQuestions.map((q) => shuffleQuestion(q));
}, [lesson, marks, shouldShuffle]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  if (!quizQuestions.length) {
    return <div className="p-6">No questions found 😭</div>;
  }

  const q = quizQuestions[index];

  const handleAnswer = (i) => {
    if (selected !== null) return;

    setSelected(i);
    if (i === q.correct) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    if (index + 1 < quizQuestions.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">Finished 😤</h1>
        <p>
          Score: {score} / {quizQuestions.length}
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-lg font-semibold">
        Q{index + 1}. {q.question}
      </h2>

      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className={`block w-full text-left p-3 rounded ${
              selected === i
                ? i === q.correct
                  ? "bg-green-600"
                  : "bg-red-600"
                : "bg-zinc-800"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {selected !== null && (
        <button
          onClick={next}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Next
        </button>
      )}
    </main>
  );
}
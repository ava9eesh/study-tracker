"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { questions as allQuestions } from "@/data/questions";

/* ─── helpers ─────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz(lessonId, marks) {
  const bank = allQuestions[lessonId];
  if (!bank) return [];
  const pool = marks === 80 ? bank.mcq80 : bank.mcq40;
  if (!pool) return [];
  return shuffle(pool).slice(0, marks);
}

/* ─── main component ───────────────────────────────────── */
export default function QuizPage({ params }) {
  const { lesson } = params;
  const searchParams = useSearchParams();
  const marks = parseInt(searchParams.get("marks") || "40", 10);

  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);   // index of chosen option
  const [revealed, setRevealed] = useState(false);  // show correct/wrong
  const [answers, setAnswers] = useState([]);        // { chosen, correct }[]
  const [done, setDone] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("in");  // "in" | "out"

  useEffect(() => {
    const q = buildQuiz(lesson, marks);
    setQuiz(q);
    setAnswers([]);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setDone(false);
  }, [lesson, marks]);

  const handleSelect = useCallback((idx) => {
    if (revealed || animating) return;
    setSelected(idx);
  }, [revealed, animating]);

  const handleReveal = useCallback(() => {
    if (selected === null || revealed || animating) return;
    setRevealed(true);
  }, [selected, revealed, animating]);

  const handleNext = useCallback(() => {
    if (!revealed || animating) return;
    const q = quiz[current];
    const newAnswers = [...answers, { chosen: selected, correct: q.correct }];
    setAnswers(newAnswers);

    if (current + 1 >= quiz.length) {
      setDone(true);
      return;
    }

    // animate out
    setDirection("out");
    setAnimating(true);
    setTimeout(() => {
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
      setDirection("in");
      setAnimating(false);
    }, 280);
  }, [revealed, animating, quiz, current, answers, selected]);

  // keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "1") handleSelect(0);
      if (e.key === "2") handleSelect(1);
      if (e.key === "3") handleSelect(2);
      if (e.key === "4") handleSelect(3);
      if (e.key === "Enter" && !revealed) handleReveal();
      if (e.key === "Enter" && revealed) handleNext();
      if (e.key === " ") { e.preventDefault(); revealed ? handleNext() : handleReveal(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSelect, handleReveal, handleNext, revealed]);

  /* ─── results ─── */
  if (done) {
    const score = answers.filter(a => a.chosen === a.correct).length;
    const pct = Math.round((score / quiz.length) * 100);
    const grade = pct >= 90 ? "S" : pct >= 75 ? "A" : pct >= 60 ? "B" : pct >= 45 ? "C" : "D";
    const gradeColor = pct >= 90 ? "#00ff88" : pct >= 75 ? "#60a5fa" : pct >= 60 ? "#fbbf24" : pct >= 45 ? "#f97316" : "#ef4444";

    return (
      <div style={styles.page}>
        <style>{css}</style>
        <div style={{ ...styles.card, maxWidth: 480, textAlign: "center", animation: "fadeUp 0.5s ease" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#4a5270", letterSpacing: "0.15em", marginBottom: "2rem" }}>
            RESULT · {lesson.toUpperCase()} · {marks} MARKS
          </div>

          <div style={{ fontSize: "6rem", fontFamily: "'Bebas Neue', sans-serif", color: gradeColor, lineHeight: 1, marginBottom: "0.5rem", textShadow: `0 0 40px ${gradeColor}44` }}>
            {grade}
          </div>

          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "#f1f5f9", marginBottom: "0.25rem" }}>
            {score} <span style={{ color: "#4a5270", fontSize: "2rem" }}>/ {quiz.length}</span>
          </div>

          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: gradeColor, marginBottom: "2.5rem" }}>
            {pct}% CORRECT
          </div>

          {/* mini answer review */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center", marginBottom: "2.5rem" }}>
            {answers.map((a, i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: "50%",
                background: a.chosen === a.correct ? "#00ff88" : "#ef4444",
                opacity: 0.85,
              }} title={`Q${i+1}: ${a.chosen === a.correct ? "✓" : "✗"}`} />
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button style={styles.btnPrimary} onClick={() => {
              const q = buildQuiz(lesson, marks);
              setQuiz(q); setAnswers([]); setCurrent(0);
              setSelected(null); setRevealed(false); setDone(false);
            }}>
              Try Again
            </button>
            <button style={styles.btnGhost} onClick={() => window.history.back()}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz.length) return (
    <div style={styles.page}>
      <style>{css}</style>
      <div style={{ color: "#4a5270", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem" }}>
        No questions found for this lesson.
      </div>
    </div>
  );

  const q = quiz[current];
  const progress = ((current) / quiz.length) * 100;

  /* ─── option state helper ─── */
  const optionState = (idx) => {
    if (!revealed) return selected === idx ? "selected" : "idle";
    if (idx === q.correct) return "correct";
    if (idx === selected && selected !== q.correct) return "wrong";
    return "idle";
  };

  const optionStyle = (idx) => {
    const state = optionState(idx);
    const base = { ...styles.option };
    if (state === "selected") return { ...base, ...styles.optionSelected };
    if (state === "correct") return { ...base, ...styles.optionCorrect };
    if (state === "wrong") return { ...base, ...styles.optionWrong };
    return base;
  };

  const optionDot = (idx) => {
    const state = optionState(idx);
    if (state === "selected") return { ...styles.dot, background: "#00ff88", boxShadow: "0 0 8px #00ff8880" };
    if (state === "correct") return { ...styles.dot, background: "#00ff88", boxShadow: "0 0 8px #00ff8880" };
    if (state === "wrong") return { ...styles.dot, background: "#ef4444", boxShadow: "0 0 8px #ef444480" };
    return styles.dot;
  };

  const labels = ["A", "B", "C", "D"];
  const isAR = q.question.startsWith("Assertion");

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* progress bar */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      {/* header */}
      <div style={styles.header}>
        <span style={styles.lessonTag}>{lesson.replace(/-/g, " ")}</span>
        <span style={styles.counter}>
          <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{current + 1}</span>
          <span style={{ color: "#2e3450" }}> / {quiz.length}</span>
        </span>
        <span style={{ ...styles.lessonTag, color: "#fbbf24", borderColor: "#fbbf2440", background: "#1a150022" }}>
          {marks} marks
        </span>
      </div>

      {/* question card */}
      <div
        key={current}
        style={{
          ...styles.card,
          animation: direction === "out" ? "slideOut 0.28s ease forwards" : "slideIn 0.28s ease",
        }}
      >
        {isAR && (
          <div style={styles.arBadge}>ASSERTION · REASON</div>
        )}

        <p style={isAR ? styles.questionAR : styles.question}>
          {q.question}
        </p>

        <div style={styles.options}>
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={optionStyle(idx)}
              disabled={revealed}
            >
              <span style={optionDot(idx)}>{labels[idx]}</span>
              <span style={{ flex: 1, textAlign: "left" }}>{opt}</span>
              {revealed && idx === q.correct && (
                <span style={{ color: "#00ff88", fontSize: "1rem", flexShrink: 0 }}>✓</span>
              )}
              {revealed && idx === selected && selected !== q.correct && (
                <span style={{ color: "#ef4444", fontSize: "1rem", flexShrink: 0 }}>✗</span>
              )}
            </button>
          ))}
        </div>

        {/* action row */}
        <div style={styles.actions}>
          {!revealed ? (
            <button
              style={selected !== null ? styles.btnPrimary : styles.btnDisabled}
              onClick={handleReveal}
              disabled={selected === null}
            >
              Check Answer
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
              <div style={selected === q.correct ? styles.feedbackCorrect : styles.feedbackWrong}>
                {selected === q.correct ? "✓ Correct!" : "✗ Incorrect"}
              </div>
              <button style={{ ...styles.btnPrimary, marginLeft: "auto" }} onClick={handleNext}>
                {current + 1 >= quiz.length ? "See Results →" : "Next →"}
              </button>
            </div>
          )}
        </div>

        <div style={styles.keyHint}>
          press <kbd style={styles.kbd}>1–4</kbd> to select · <kbd style={styles.kbd}>Enter</kbd> to confirm
        </div>
      </div>

      {/* bottom nav */}
      <div style={styles.bottomNav}>
        <button style={styles.navBtn} onClick={() => window.history.back()}>← Back</button>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#2e3450" }}>
          {answers.filter(a => a.chosen === a.correct).length} correct so far
        </div>
        <div style={{ width: 60 }} />
      </div>
    </div>
  );
}

/* ─── styles ───────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#080a10",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 1rem 6rem",
    position: "relative",
  },
  progressTrack: {
    position: "fixed",
    top: 0, left: 0, right: 0,
    height: "2px",
    background: "#12151f",
    zIndex: 100,
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #00ff88, #00d4ff)",
    transition: "width 0.4s ease",
  },
  header: {
    width: "100%",
    maxWidth: 680,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.25rem 0 1rem",
    gap: "0.5rem",
  },
  lessonTag: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.65rem",
    letterSpacing: "0.12em",
    color: "#4a5270",
    border: "1px solid #1e2535",
    borderRadius: "4px",
    padding: "3px 8px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px",
  },
  counter: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.8rem",
  },
  card: {
    width: "100%",
    maxWidth: 680,
    background: "#0e1018",
    border: "1px solid #1e2535",
    borderRadius: "16px",
    padding: "2rem 2rem 1.5rem",
    marginTop: "0.5rem",
  },
  arBadge: {
    display: "inline-block",
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.6rem",
    letterSpacing: "0.15em",
    color: "#fbbf24",
    background: "#1a150022",
    border: "1px solid #fbbf2440",
    borderRadius: "4px",
    padding: "2px 8px",
    marginBottom: "1rem",
  },
  question: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "1.1rem",
    fontWeight: 500,
    color: "#e8edf5",
    lineHeight: 1.65,
    marginBottom: "1.75rem",
    whiteSpace: "pre-wrap",
  },
  questionAR: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "0.95rem",
    fontWeight: 400,
    color: "#e8edf5",
    lineHeight: 1.75,
    marginBottom: "1.75rem",
    whiteSpace: "pre-wrap",
    background: "#0a0d16",
    border: "1px solid #1e2535",
    borderRadius: "10px",
    padding: "1rem 1.25rem",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    marginBottom: "1.5rem",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
    padding: "0.85rem 1rem",
    borderRadius: "10px",
    border: "1px solid #1e2535",
    background: "#0a0d16",
    color: "#94a3b8",
    fontFamily: "'Outfit', sans-serif",
    fontSize: "0.9rem",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.15s ease",
    width: "100%",
  },
  optionSelected: {
    border: "1px solid #00ff8855",
    background: "#00ff8808",
    color: "#e8edf5",
  },
  optionCorrect: {
    border: "1px solid #00ff8866",
    background: "#00ff8810",
    color: "#e8edf5",
  },
  optionWrong: {
    border: "1px solid #ef444455",
    background: "#ef444408",
    color: "#94a3b8",
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: "6px",
    background: "#151820",
    border: "1px solid #2e3450",
    color: "#4a5270",
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.7rem",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.15s ease",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  btnPrimary: {
    padding: "0.7rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    background: "#00ff88",
    color: "#050708",
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
  },
  btnDisabled: {
    padding: "0.7rem 1.5rem",
    borderRadius: "8px",
    border: "1px solid #1e2535",
    background: "transparent",
    color: "#2e3450",
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    cursor: "not-allowed",
    whiteSpace: "nowrap",
  },
  btnGhost: {
    padding: "0.7rem 1.5rem",
    borderRadius: "8px",
    border: "1px solid #1e2535",
    background: "transparent",
    color: "#4a5270",
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.8rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
  },
  feedbackCorrect: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#00ff88",
    letterSpacing: "0.05em",
  },
  feedbackWrong: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#ef4444",
    letterSpacing: "0.05em",
  },
  keyHint: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.65rem",
    color: "#2e3450",
    textAlign: "center",
    marginTop: "0.5rem",
  },
  kbd: {
    background: "#12151f",
    border: "1px solid #2e3450",
    borderRadius: "3px",
    padding: "0px 4px",
    fontSize: "0.65rem",
    color: "#4a5270",
    fontFamily: "inherit",
  },
  bottomNav: {
    position: "fixed",
    bottom: 0, left: 0, right: 0,
    padding: "0.85rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(8,10,16,0.92)",
    backdropFilter: "blur(12px)",
    borderTop: "1px solid #12151f",
    zIndex: 50,
  },
  navBtn: {
    background: "none",
    border: "none",
    color: "#4a5270",
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.75rem",
    cursor: "pointer",
    padding: "4px 0",
  },
};

/* ─── CSS animations ───────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOut {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(-24px); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  button:not(:disabled):hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
  button:not(:disabled):active {
    transform: translateY(0);
  }
`;
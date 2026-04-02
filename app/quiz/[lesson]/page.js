"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { questions as QUESTION_BANK } from "@/data/questions";

// Shuffle function for options
function shuffleQuestion(q) {
  const arr = q.options.map((opt, i) => ({
    text: opt,
    correct: i === q.correct,
  }));

  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return {
    ...q,
    options: arr.map((o) => o.text),
    correct: arr.findIndex((o) => o.correct),
  };
}

export default function QuizPage() {
  const params = useParams();
  const lesson = params.lessonId || params.lesson;
  const searchParams = useSearchParams();
  const marks = Number(searchParams.get("marks")) || 40;
  const mode = marks === 80 ? "mcq80" : "mcq40";

  // Strong normalization
  const normalizedId = lesson
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-");

  const lessonBlock = QUESTION_BANK[lesson] || QUESTION_BANK[normalizedId];

  // Shuffle questions once on mount
  const questions = useMemo(() => {
    if (!lessonBlock || !lessonBlock[mode]) return [];
    return lessonBlock[mode].map((q) => shuffleQuestion(q));
  }, [lesson, mode]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    setMounted(true);
    // Start timer
    const start = Date.now();
    setStartTime(start);
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    
    setTimerInterval(interval);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!lessonBlock || !lessonBlock[mode] || questions.length === 0) {
    return (
      <main style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
        textAlign: "center"
      }}>
        <div className="glass-card" style={{ padding: "3rem 2rem" }}>
          <div style={{
            fontSize: "4rem",
            marginBottom: "1.5rem",
            animation: "pulse 2s ease-in-out infinite"
          }}>
            🤔
          </div>
          <h1 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "1rem"
          }}>
            Quiz Not Found
          </h1>
          <p style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: "1.125rem",
            color: "var(--text-tertiary)",
            marginBottom: "1.5rem"
          }}>
            No questions available for this lesson yet.
          </p>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.875rem",
            color: "var(--text-muted)"
          }}>
            Lesson ID: {lesson}
          </p>
        </div>
      </main>
    );
  }

  const current = questions[index];

  const handleSelect = (optionIndex) => {
    if (selected !== null) return; // Already selected
    setSelected(optionIndex);
    setShowFeedback(true);

    // Update score
    if (optionIndex === current.correct) {
      setScore((s) => s + 1);
    }

    // Store answer
    setAnswers((prev) => [...prev, optionIndex]);
  };

  const handleNext = () => {
    // If no answer selected, mark as skipped (-1)
    if (selected === null) {
      setAnswers((prev) => [...prev, -1]);
    }
    
    if (index + 1 === questions.length) {
      setFinished(true);
      if (timerInterval) clearInterval(timerInterval);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  const handleBack = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      // Restore previous answer if exists
      const prevAnswer = answers[index - 1];
      if (prevAnswer !== undefined && prevAnswer !== -1) {
        setSelected(prevAnswer);
        setShowFeedback(true);
      } else {
        setSelected(null);
        setShowFeedback(false);
      }
      // Remove last answer from array
      setAnswers((prev) => prev.slice(0, -1));
    }
  };

  const handleSkip = () => {
    setAnswers((prev) => [...prev, -1]);
    if (index + 1 === questions.length) {
      setFinished(true);
      if (timerInterval) clearInterval(timerInterval);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  // Result Screen
  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    let resultEmoji = "🎉";
    let resultText = "Excellent!";
    let resultColor = "var(--accent-emerald)";

    if (percentage < 40) {
      resultEmoji = "📚";
      resultText = "Keep Practicing!";
      resultColor = "#ef4444";
    } else if (percentage < 70) {
      resultEmoji = "💪";
      resultText = "Good Effort!";
      resultColor = "var(--accent-amber)";
    } else if (percentage < 90) {
      resultEmoji = "🌟";
      resultText = "Great Job!";
      resultColor = "var(--accent-cyan)";
    }

    return (
      <>
        <style>{`
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          
          .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            background: var(--accent-amber);
            animation: confetti 3s ease-out forwards;
          }

          .result-badge {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            display: inline-block;
            margin: 0.25rem;
          }

          .correct-badge {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: var(--accent-emerald);
          }

          .wrong-badge {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #ef4444;
          }
        `}</style>

        {percentage >= 70 && Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}px`,
              background: ['#fbbf24', '#22d3ee', '#a78bfa', '#f472b6'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}

        <main style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 5rem",
          position: "relative",
          zIndex: 10
        }}>
          {/* Result Header */}
          <div className="glass-card" style={{
            padding: "3rem 2.5rem",
            marginBottom: "2rem",
            textAlign: "center",
            animation: "scaleIn 0.5s var(--ease-spring)"
          }}>
            <div style={{
              fontSize: "5rem",
              marginBottom: "1rem",
              animation: "pulse 2s ease-in-out infinite"
            }}>
              {resultEmoji}
            </div>
            <h1 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "2.5rem",
              fontWeight: 800,
              color: resultColor,
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em"
            }}>
              {resultText}
            </h1>
            <p style={{
              fontFamily: "'Crimson Pro', serif",
              fontSize: "1.25rem",
              color: "var(--text-tertiary)",
              marginBottom: "2rem",
              fontStyle: "italic"
            }}>
              Quiz Completed
            </p>

            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              flexWrap: "wrap"
            }}>
              <div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: resultColor,
                  lineHeight: 1
                }}>
                  {score}/{questions.length}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  marginTop: "0.5rem"
                }}>
                  CORRECT ANSWERS
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: resultColor,
                  lineHeight: 1
                }}>
                  {percentage}%
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  marginTop: "0.5rem"
                }}>
                  SCORE
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: "var(--accent-cyan)",
                  lineHeight: 1
                }}>
                  {formatTime(elapsedTime)}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  marginTop: "0.5rem"
                }}>
                  TIME TAKEN
                </div>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{
                marginTop: "2rem",
                padding: "1rem 2rem"
              }}
            >
              🔄 Retake Quiz
            </button>
          </div>

          {/* Review Section */}
          <h2 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "1.5rem"
          }}>
            📋 Answer Review
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {questions.map((q, i) => {
              const userAns = answers[i];
              const correctAns = q.correct;
              const isSkipped = userAns === -1 || userAns === undefined;
              const isCorrect = !isSkipped && userAns === correctAns;

              return (
                <div
                  key={i}
                  className="glass-card"
                  style={{
                    padding: "1.5rem",
                    borderLeft: `4px solid ${
                      isSkipped ? "#94a3b8" : isCorrect ? "var(--accent-emerald)" : "#ef4444"
                    }`,
                    opacity: 0,
                    animation: `fadeInUp 0.3s ease-out ${i * 0.05}s forwards`
                  }}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    marginBottom: "1rem"
                  }}>
                    <span style={{
                      flexShrink: 0,
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: isSkipped
                        ? "rgba(148, 163, 184, 0.1)"
                        : isCorrect
                        ? "rgba(16, 185, 129, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                      border: `1px solid ${
                        isSkipped
                          ? "rgba(148, 163, 184, 0.3)"
                          : isCorrect
                          ? "rgba(16, 185, 129, 0.3)"
                          : "rgba(239, 68, 68, 0.3)"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: isSkipped ? "#94a3b8" : isCorrect ? "var(--accent-emerald)" : "#ef4444"
                    }}>
                      {isSkipped ? "⊘" : i + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: "1rem",
                        lineHeight: 1.5
                      }}>
                        {q.question}
                      </p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {isSkipped ? (
                          <div className="result-badge" style={{
                            background: "rgba(148, 163, 184, 0.1)",
                            border: "1px solid rgba(148, 163, 184, 0.3)",
                            color: "#94a3b8"
                          }}>
                            ⊘ Skipped
                          </div>
                        ) : (
                          q.options.map((opt, idx) => {
                            const isUserAnswer = idx === userAns;
                            const isCorrectAnswer = idx === correctAns;
                            
                            return (
                              <div
                                key={idx}
                                className={
                                  isCorrectAnswer ? "correct-badge" :
                                  isUserAnswer ? "wrong-badge" :
                                  "result-badge"
                                }
                                style={{
                                  background: !isCorrectAnswer && !isUserAnswer
                                    ? "var(--bg-elevated)"
                                    : undefined,
                                  border: !isCorrectAnswer && !isUserAnswer
                                    ? "1px solid var(--border-subtle)"
                                    : undefined,
                                  color: !isCorrectAnswer && !isUserAnswer
                                    ? "var(--text-muted)"
                                    : undefined
                                }}
                              >
                                {isCorrectAnswer && "✓ "}
                                {isUserAnswer && !isCorrectAnswer && "✗ "}
                                {opt}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </>
    );
  }

  // Quiz UI
  const progress = ((index + 1) / questions.length) * 100;

  return (
    <main style={{
      maxWidth: "700px",
      margin: "0 auto",
      padding: "2.5rem 1.5rem 5rem",
      position: "relative",
      zIndex: 10
    }}>
      {/* Progress Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          gap: "1rem",
          flexWrap: "wrap"
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.25rem"
            }}>
              Quiz Time! 🎯
            </h1>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.875rem",
              color: "var(--text-tertiary)"
            }}>
              Question {index + 1} / {questions.length}
            </span>
          </div>
          <div style={{
            padding: "0.75rem 1.25rem",
            background: "var(--glass-bg)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--border-medium)",
            borderRadius: "10px"
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginBottom: "0.25rem",
              textAlign: "center"
            }}>
              ⏱️ TIME
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--accent-cyan)",
              textAlign: "center"
            }}>
              {formatTime(elapsedTime)}
            </div>
          </div>
        </div>
        
        <div className="progress-container" style={{ height: "8px" }}>
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
              transition: "width 0.3s var(--ease-smooth)"
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        className="glass-card"
        style={{
          padding: "2.5rem 2rem",
          marginBottom: "1.5rem",
          animation: "fadeIn 0.3s ease-out"
        }}
      >
        <h2 style={{
          fontFamily: "'Crimson Pro', serif",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          lineHeight: 1.6,
          marginBottom: "2rem"
        }}>
          {current.question}
        </h2>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {current.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === current.correct;
            const showCorrect = showFeedback && isCorrect;
            const showWrong = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
                style={{
                  width: "100%",
                  padding: "1.25rem 1.5rem",
                  textAlign: "left",
                  background: showCorrect
                    ? "rgba(16, 185, 129, 0.1)"
                    : showWrong
                    ? "rgba(239, 68, 68, 0.1)"
                    : isSelected
                    ? "var(--accent-amber-glow)"
                    : "var(--bg-elevated)",
                  border: `2px solid ${
                    showCorrect
                      ? "var(--accent-emerald)"
                      : showWrong
                      ? "#ef4444"
                      : isSelected
                      ? "var(--accent-amber)"
                      : "var(--border-subtle)"
                  }`,
                  borderRadius: "12px",
                  color: showCorrect
                    ? "var(--accent-emerald)"
                    : showWrong
                    ? "#ef4444"
                    : isSelected
                    ? "var(--accent-amber)"
                    : "var(--text-secondary)",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: selected !== null ? "not-allowed" : "pointer",
                  transition: "all 0.2s var(--ease-smooth)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  opacity: selected !== null && !isSelected && !showCorrect ? 0.4 : 1
                }}
                className={selected === null ? "clickable" : ""}
              >
                <span style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: `2px solid currentColor`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: isSelected ? "currentColor" : "transparent",
                  color: isSelected ? "var(--bg-primary)" : "currentColor",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.75rem",
                  fontWeight: 700
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
                {showCorrect && <span style={{ fontSize: "1.25rem" }}>✓</span>}
                {showWrong && <span style={{ fontSize: "1.25rem" }}>✗</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{
        display: "flex",
        gap: "0.75rem",
        marginTop: "1.5rem",
        flexWrap: "wrap"
      }}>
        {/* Back Button */}
        <button
          onClick={handleBack}
          disabled={index === 0}
          className="btn-ghost"
          style={{
            flex: "1",
            padding: "1rem",
            fontSize: "0.9375rem",
            opacity: index === 0 ? 0.4 : 1,
            cursor: index === 0 ? "not-allowed" : "pointer"
          }}
        >
          ← Back
        </button>

        {/* Skip Button */}
        {selected === null && (
          <button
            onClick={handleSkip}
            className="btn-secondary"
            style={{
              flex: "1",
              padding: "1rem",
              fontSize: "0.9375rem"
            }}
          >
            Skip ⏭️
          </button>
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="btn-primary"
          style={{
            flex: "2",
            padding: "1rem",
            fontSize: "0.9375rem",
            opacity: selected === null ? 0.6 : 1
          }}
        >
          {index + 1 === questions.length ? "🎉 Finish" : "Next →"}
        </button>
      </div>

      {/* Score Indicator */}
      <div style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "var(--glass-bg)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.875rem",
          color: "var(--text-tertiary)"
        }}>
          Current Score
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "1.125rem",
          fontWeight: 700,
          color: "var(--accent-amber)"
        }}>
          {score} / {index + (selected !== null ? 1 : 0)}
        </span>
      </div>
    </main>
  );
}
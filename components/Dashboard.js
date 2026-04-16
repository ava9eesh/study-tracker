"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";
import DonationBanner from '@/components/DonationBanner';

const STATUS = ["todo", "doing", "done", "mastered"];

const STATUS_CONFIG = {
  todo: { 
    label: "To Do", 
    color: "rgba(71, 85, 105, 0.1)", 
    border: "rgba(71, 85, 105, 0.3)",
    text: "#94a3b8",
    glow: "rgba(148, 163, 184, 0.2)"
  },
  doing: { 
    label: "In Progress", 
    color: "rgba(59, 130, 246, 0.1)", 
    border: "rgba(59, 130, 246, 0.3)",
    text: "#60a5fa",
    glow: "rgba(96, 165, 250, 0.2)"
  },
  done: { 
    label: "Completed", 
    color: "rgba(16, 185, 129, 0.1)", 
    border: "rgba(16, 185, 129, 0.3)",
    text: "#34d399",
    glow: "rgba(52, 211, 153, 0.2)"
  },
  mastered: { 
    label: "Mastered", 
    color: "rgba(168, 85, 247, 0.1)", 
    border: "rgba(168, 85, 247, 0.3)",
    text: "#c084fc",
    glow: "rgba(192, 132, 252, 0.2)"
  },
};

const SUBJECT_TOTALS = {
  "9": {
    Science: 12, Mathematics: 12,
    SST: 20, History: 5, Civics: 5, Geography: 6, Economics: 4,
    English: 26, Beehive: 17, Moments: 9,
    Hindi: 15, Sparsh: 11, Sanchayan: 4,
  },
  "10": {
    Science: 13, Mathematics: 14,
    SST: 23, History: 5, Geography: 7, Civics: 6, Economics: 5,
    English: 18, FirstFlight: 9, Footprints: 9,
    Hindi: 17, Sparsh: 14, Sanchayan: 3,
  },
};

const SUBJECT_ICONS = {
  Science: "⚗️", 
  Mathematics: "∑", 
  SST: "🌏", 
  English: "📖", 
  Hindi: "अ",
  History: "📜", 
  Civics: "⚖️", 
  Geography: "🗺️", 
  Economics: "📊",
  FirstFlight: "✈️", 
  Footprints: "👣", 
  Beehive: "🐝", 
  Moments: "💫",
  Sparsh: "✨", 
  Sanchayan: "📚",
};

export default function Dashboard() {
  const CLASSES = ["9", "10"];
  const [currentClass, setCurrentClass] = useState("9");
  const [open, setOpen] = useState({});
  const [search, setSearch] = useState("");
  const [lessonData, setLessonData] = useState({});
  const [saveFlash, setSaveFlash] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(`lessonData_class${currentClass}`);
    if (saved) setLessonData(JSON.parse(saved));
    else setLessonData({});
  }, [currentClass]);

  const saveProgress = () => {
    localStorage.setItem(`lessonData_class${currentClass}`, JSON.stringify(lessonData));
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);
  };

  const resetProgress = () => {
    if (!confirm("⚠️ Reset all progress for Class " + currentClass + "? This cannot be undone.")) return;
    setLessonData({});
    localStorage.removeItem(`lessonData_class${currentClass}`);
  };

  const nodeHasMatch = (node, query) => {
    if (!query) return false;
    if (Array.isArray(node)) {
      return node.some((l) => {
        const name = typeof l === "string" ? l : l.name;
        return name.toLowerCase().includes(query.toLowerCase());
      });
    }
    if (typeof node === "object" && node !== null) {
      return Object.values(node).some((v) => nodeHasMatch(v, query));
    }
    return false;
  };

  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const updateLesson = (id, patch) => {
    setLessonData((p) => ({
      ...p,
      [id]: { status: "todo", revisions: 0, pyqs: 0, ...p[id], ...patch },
    }));
  };

  const countCompletedLessons = (node) => {
    if (Array.isArray(node)) {
      return node.filter((lesson) => {
        const name = typeof lesson === "string" ? lesson : lesson.name;
        return lessonData[name]?.status === "done" || lessonData[name]?.status === "mastered";
      }).length;
    }
    if (typeof node === "object" && node !== null) {
      return Object.values(node).reduce((sum, v) => sum + countCompletedLessons(v), 0);
    }
    return 0;
  };

  const getTotalLessons = (node) => {
    if (Array.isArray(node)) return node.length;
    if (typeof node === "object" && node !== null) {
      return Object.values(node).reduce((sum, v) => sum + getTotalLessons(v), 0);
    }
    return 0;
  };

  const renderLesson = (lesson, meta) => {
    if (search && !lesson.toLowerCase().includes(search.toLowerCase())) return null;
    const id = lesson;
    const data = lessonData[id] || { status: "todo", revisions: 0, pyqs: 0 };
    const cfg = STATUS_CONFIG[data.status] || STATUS_CONFIG.todo;
    const lessonId = lesson.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    return (
      <div
        key={id}
        className="glass-card"
        style={{
          marginTop: "1rem",
          padding: "1.25rem 1.5rem",
          borderLeft: `3px solid ${cfg.text}`
        }}
      >
        {/* Lesson Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: cfg.text,
              flexShrink: 0,
              boxShadow: `0 0 12px ${cfg.glow}`,
              animation: "pulse 2s ease-in-out infinite"
            }}
          />
          <h4 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            flex: 1
          }}>
            {lesson}
          </h4>
        </div>

        {/* Status Pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {STATUS.map((s) => {
            const sc = STATUS_CONFIG[s];
            const active = data.status === s;
            return (
              <button
                key={s}
                onClick={() => updateLesson(id, { status: s })}
                className="status-badge"
                style={{
                  background: active ? sc.color : "transparent",
                  borderColor: active ? sc.border : "var(--border-subtle)",
                  color: active ? sc.text : "var(--text-ghost)",
                  boxShadow: active ? `0 0 12px ${sc.glow}` : "none",
                  transform: active ? "scale(1.02)" : "scale(1)"
                }}
              >
                {sc.label}
              </button>
            );
          })}
        </div>

        {/* Counters */}
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", flexWrap: "wrap" }} className="lesson-counters">
          {[
            { field: "revisions", label: "Revisions", icon: "🔄" },
            { field: "pyqs", label: "PYQs Done", icon: "📝" }
          ].map(({ field, label, icon }) => (
            <div key={field} style={{ display: "flex", alignItems: "center", gap: "0.625rem", flex: "1 1 auto", minWidth: "180px" }}>
              <button
                onClick={() => updateLesson(id, { [field]: Math.max(0, (data[field] || 0) - 1) })}
                className="btn-ghost"
                style={{
                  width: 28,
                  height: 28,
                  padding: 0,
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem"
                }}
              >
                −
              </button>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                minWidth: "7rem",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem"
              }}>
                <span style={{ opacity: 0.6 }}>{icon}</span>
                <span style={{ color: "var(--accent-amber)", fontWeight: 700 }}>{data[field] || 0}</span>
                <span style={{ color: "var(--text-tertiary)" }}>{label}</span>
              </span>
              <button
                onClick={() => updateLesson(id, { [field]: (data[field] || 0) + 1 })}
                className="btn-ghost"
                style={{
                  width: 28,
                  height: 28,
                  padding: 0,
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem"
                }}
              >
                +
              </button>
            </div>
          ))}
        </div>

        {/* Resource Links */}
        {(meta?.video || meta?.pyq) && (
          <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem" }}>
            {meta?.video && (
              <a
                href={meta.video}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <span style={{ fontSize: "1rem" }}>▶️</span>
                Video Lesson
              </a>
            )}
            {meta?.pyq && (
              <a
                href={meta.pyq}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <span style={{ fontSize: "1rem" }}>📄</span>
                Practice PYQs
              </a>
            )}
          </div>
        )}

        {/* Contextual Action Links */}
        {data.status === "todo" && (
          <a
            href={`/lesson/${lessonId}/prerequisites`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
              fontSize: "0.85rem",
              color: "var(--accent-cyan)",
              fontFamily: "'JetBrains Mono', monospace",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
            className="hover-link"
          >
            <span>→</span>
            <span>Check Prerequisites</span>
          </a>
        )}

        {data.status === "done" && (
          <a
            href={`/quiz/${lessonId}?marks=40`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
              fontSize: "0.85rem",
              color: "var(--accent-emerald)",
              fontFamily: "'JetBrains Mono', monospace",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
            className="hover-link"
          >
            <span>→</span>
            <span>Take Assessment (40 marks)</span>
          </a>
        )}

        {data.status === "mastered" && (
          <a
            href={`/quiz/${lessonId}?marks=80`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
              fontSize: "0.85rem",
              color: "var(--accent-violet)",
              fontFamily: "'JetBrains Mono', monospace",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
            className="hover-link"
          >
            <span>→</span>
            <span>Master Test (80 marks)</span>
          </a>
        )}
      </div>
    );
  };

  const renderNode = (node) => {
    if (Array.isArray(node)) {
      return node.map((lesson) => {
        if (typeof lesson === "string") {
          return renderLesson(lesson, null);
        } else {
          return renderLesson(lesson.name, lesson);
        }
      });
    }

    return Object.entries(node).map(([key, value]) => {
      const hasMatch = search && nodeHasMatch(value, search);
      const isOpen = open[key] || hasMatch;
      const completed = countCompletedLessons(value);
      const total = getTotalLessons(value);
      const progress = total > 0 ? (completed / total) * 100 : 0;

      return (
        <div key={key} style={{ marginTop: "1.25rem" }}>
          <button
            onClick={() => toggle(key)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.875rem 1rem",
              background: isOpen ? "var(--glass-bg)" : "transparent",
              border: `1px solid ${isOpen ? "var(--border-medium)" : "var(--border-subtle)"}`,
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backdropFilter: isOpen ? "blur(12px)" : "none"
            }}
            className="clickable"
          >
            <span style={{ 
              fontSize: "0.9rem", 
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)"
            }}>
              ▶
            </span>
            <span style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-secondary)"
            }}>
              {key}
            </span>
            <div style={{ flex: 1, margin: "0 1rem" }}>
              <div className="progress-container" style={{ height: "5px" }}>
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${progress}%`,
                    background: progress === 100 
                      ? "linear-gradient(90deg, #10b981, #34d399)" 
                      : "linear-gradient(90deg, #f59e0b, #fbbf24)"
                  }} 
                />
              </div>
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: progress === 100 ? "var(--accent-emerald)" : "var(--text-muted)"
            }}>
              {completed}/{total}
            </span>
          </button>

          {isOpen && (
            <div style={{ paddingLeft: "1rem", marginTop: "0.75rem" }}>
              {renderNode(value)}
            </div>
          )}
        </div>
      );
    });
  };

  const currentSyllabus = syllabus[currentClass] || {};
  const doneAll = countCompletedLessons(currentSyllabus);
  const totalAll = getTotalLessons(currentSyllabus);
  const overallPct = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

  if (!mounted) return null;

  return (
    <>
      <style>{`
        .hover-link:hover {
          transform: translateX(4px);
          text-shadow: 0 0 8px currentColor;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .hero-header {
            margin-bottom: 1.5rem !important;
          }
          
          .hero-header h1 {
            font-size: 1.75rem !important;
          }
          
          .hero-header p {
            font-size: 0.9375rem !important;
          }
          
          .controls-row {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          
          .controls-row > div {
            margin-left: 0 !important;
            width: 100%;
          }
          
          .class-buttons {
            display: flex;
            gap: 0.5rem;
            width: 100%;
          }
          
          .class-buttons button {
            flex: 1;
            min-height: 44px;
          }
          
          .action-buttons {
            display: flex;
            gap: 0.5rem;
            width: 100%;
          }
          
          .action-buttons button {
            flex: 1;
            min-height: 44px;
          }
          
          .subject-card-header {
            padding: 1rem !important;
          }
          
          .lesson-counters {
            flex-direction: column !important;
            gap: 1rem !important;
          }
        }
      `}</style>

      <main 
        style={{ 
          maxWidth: "800px", 
          margin: "0 auto", 
          padding: "max(1.5rem, env(safe-area-inset-top)) 1rem 5rem",
          position: "relative",
          zIndex: 10,
          paddingTop: "calc(max(1.5rem, env(safe-area-inset-top)) + 1rem)"
        }}
      >
        {/* Hero Header */}
        <div style={{ marginBottom: "2rem" }} className="hero-header">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
            <h1 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: 800,
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              letterSpacing: "-0.02em"
            }}>
              Study Tracker
            </h1>
            <span 
              className="status-badge"
              style={{
                background: "var(--accent-amber-glow)",
                borderColor: "var(--accent-amber)",
                color: "var(--accent-amber)",
                fontWeight: 700,
                padding: "0.375rem 0.875rem",
                fontSize: "0.8125rem"
              }}
            >
              Class {currentClass}
            </span>
          </div>

          <p style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: "1rem",
            color: "var(--text-tertiary)",
            margin: "0 0 1rem 0",
            fontStyle: "italic"
          }}>
            {doneAll} of {totalAll} lessons completed — keep going! 🚀
          </p>

          {/* Overall Progress */}
          <div className="progress-container" style={{ height: "8px", marginBottom: "0.5rem" }}>
            <div 
              className="progress-bar" 
              style={{ 
                width: `${overallPct}%`,
                background: overallPct === 100
                  ? "linear-gradient(90deg, #10b981, #34d399)"
                  : "linear-gradient(90deg, #f59e0b, #fbbf24)"
              }} 
            />
          </div>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
            marginTop: "0.25rem",
            textAlign: "right"
          }}>
            {overallPct}% Complete
          </p>
        </div>

        {/* Controls Bar */}
        <div style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap"
        }}
        className="controls-row"
        >
          <div className="class-buttons">
            {CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => setCurrentClass(cls)}
                className={currentClass === cls ? "btn-primary" : "btn-ghost"}
                style={{
                  padding: "0.625rem 1.25rem",
                  fontSize: "0.8125rem"
                }}
              >
                Class {cls}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: "auto" }} className="action-buttons">
            <button
              onClick={saveProgress}
              className="btn-primary"
              style={{
                padding: "0.625rem 1.25rem",
                fontSize: "0.8125rem",
                background: saveFlash 
                  ? "linear-gradient(135deg, #10b981, #34d399)" 
                  : "linear-gradient(135deg, #fbbf24, #f59e0b)",
                transition: "all 0.3s ease"
              }}
            >
              {saveFlash ? "✓ Saved!" : "💾 Save"}
            </button>
            <button
              onClick={resetProgress}
              className="btn-ghost"
              style={{
                padding: "0.625rem 1.25rem",
                fontSize: "0.8125rem",
                color: "#ef4444"
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: "relative", marginBottom: "2rem" }}>
          <span style={{
            position: "absolute",
            left: "1.25rem",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1.125rem",
            color: "var(--text-ghost)",
            pointerEvents: "none"
          }}>
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a lesson..."
            className="input"
            style={{
              paddingLeft: "3rem",
              fontSize: "0.9375rem"
            }}
          />
        </div>

        {/* Subject Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {Object.entries(currentSyllabus).map(([subjectName, subjectData], idx) => {
            const completed = countCompletedLessons(subjectData);
            const total = getTotalLessons(subjectData);
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const icon = SUBJECT_ICONS[subjectName] ?? "📌";
            const isOpen = open[subjectName] || (search && nodeHasMatch(subjectData, search));

            return (
              <div
                key={subjectName}
                className="glass-card"
                style={{
                  padding: 0
                }}
              >
                {/* Subject Header */}
                <button
                  onClick={() => toggle(subjectName)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.25rem 1.5rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  className="clickable subject-card-header"
                >
                  <span style={{
                    fontSize: "1.75rem",
                    filter: isOpen ? "grayscale(0)" : "grayscale(0.5)",
                    transition: "filter 0.2s ease"
                  }}>
                    {icon}
                  </span>

                  <div style={{ flex: 1, textAlign: "left" }}>
                    <h3 style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "0.5rem"
                    }}>
                      {subjectName}
                    </h3>
                    <div className="progress-container" style={{ height: "6px" }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${pct}%`,
                          background: pct === 100
                            ? "linear-gradient(90deg, #10b981, #34d399)"
                            : "linear-gradient(90deg, #f59e0b, #fbbf24)"
                        }} 
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.8125rem",
                      color: pct === 100 ? "var(--accent-emerald)" : "var(--text-muted)",
                      marginBottom: "0.25rem"
                    }}>
                      {completed}/{total}
                    </p>
                    <span style={{
                      fontSize: "0.75rem",
                      color: isOpen ? "var(--accent-amber)" : "var(--text-ghost)",
                      transition: "all 0.2s ease",
                      display: "inline-block",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                    }}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* Subject Content */}
                {isOpen && (
                  <>
                    <div style={{
                      height: "1px",
                      background: "linear-gradient(90deg, transparent, var(--border-medium), transparent)",
                      margin: "0 1.5rem"
                    }} />
                    <div style={{ padding: "1.25rem 1.5rem" }}>
                      {renderNode(subjectData)}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
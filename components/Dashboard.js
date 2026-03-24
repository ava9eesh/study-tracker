"use client";

import { useEffect, useState } from "react";
import { syllabus } from "../data/syllabus";

const STATUS = ["todo", "doing", "done", "mastered"];

const STATUS_CONFIG = {
  todo:     { label: "Todo",     color: "#334155", text: "#94a3b8", dot: "#475569" },
  doing:    { label: "Doing",    color: "#1e3a5f", text: "#60a5fa", dot: "#3b82f6" },
  done:     { label: "Done",     color: "#14532d", text: "#4ade80", dot: "#22c55e" },
  mastered: { label: "Mastered", color: "#3b1764", text: "#c084fc", dot: "#a855f7" },
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
  Science: "⚗️", Mathematics: "∑", SST: "🌏", English: "📖", Hindi: "अ",
  History: "📜", Civics: "⚖️", Geography: "🗺️", Economics: "📊",
  FirstFlight: "✈️", Footprints: "👣", Beehive: "🐝", Moments: "💫",
  Sparsh: "✨", Sanchayan: "📚",
};

export default function Dashboard() {
  const CLASSES = ["9", "10"];
  const [currentClass, setCurrentClass] = useState("9");
  const [open, setOpen] = useState({});
  const [search, setSearch] = useState("");
  const [lessonData, setLessonData] = useState({});
  const [saveFlash, setSaveFlash] = useState(false);

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
    if (!confirm("Reset all progress for this class?")) return;
    setLessonData({});
    localStorage.removeItem(`lessonData_class${currentClass}`);
  };

  // Check if a node contains any lesson matching the search
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
      <div key={id} style={{
        marginLeft: "1rem",
        marginTop: "0.75rem",
        background: "#181b28",
        border: `1px solid ${cfg.dot}30`,
        borderLeft: `3px solid ${cfg.dot}`,
        borderRadius: "10px",
        padding: "1rem 1.25rem",
        transition: "all 0.2s ease",
      }}>
        {/* Lesson name + status dot */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, display: "inline-block", flexShrink: 0, boxShadow: `0 0 6px ${cfg.dot}` }} />
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#f1f5f9", letterSpacing: "0.01em" }}>{lesson}</span>
        </div>

        {/* Status buttons */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {STATUS.map((s) => {
            const sc = STATUS_CONFIG[s];
            const active = data.status === s;
            return (
              <button key={s} onClick={() => updateLesson(id, { status: s })}
                style={{
                  padding: "3px 10px",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  border: active ? `1px solid ${sc.dot}60` : "1px solid #1e2535",
                  background: active ? sc.color : "transparent",
                  color: active ? sc.text : "#475569",
                  transition: "all 0.15s ease",
                }}
              >{s.toUpperCase()}</button>
            );
          })}
        </div>

        {/* Counters */}
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "0.75rem" }}>
          {[["revisions", "REV"], ["pyqs", "PYQ"]].map(([field, label]) => (
            <div key={field} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <button onClick={() => updateLesson(id, { [field]: Math.max(0, (data[field] || 0) - 1) })}
                style={{ width: 20, height: 20, borderRadius: "4px", background: "#252840", border: "1px solid #3a4060", color: "#8892aa", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#a0aec0", minWidth: "4rem" }}>
                <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{data[field] || 0}</span> {label}
              </span>
              <button onClick={() => updateLesson(id, { [field]: (data[field] || 0) + 1 })}
                style={{ width: 20, height: 20, borderRadius: "4px", background: "#252840", border: "1px solid #3a4060", color: "#8892aa", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
          {meta?.video && <a href={meta.video} target="_blank" style={{ fontSize: "0.75rem", color: "#60a5fa", textDecoration: "none", fontFamily: "'DM Mono', monospace" }}>▶ Video</a>}
          {meta?.pyq && <a href={meta.pyq} target="_blank" style={{ fontSize: "0.75rem", color: "#f59e0b", textDecoration: "none", fontFamily: "'DM Mono', monospace" }}>📄 PYQs</a>}
        </div>

        {/* Action link */}
        {data.status === "todo" && (
          <a href={`/lesson/${lessonId}/prerequisites`}
            style={{ display: "inline-block", marginTop: "0.25rem", fontSize: "0.75rem", color: "#60a5fa", fontFamily: "'DM Mono', monospace" }}>
            → Prerequisites
          </a>
        )}
        {data.status === "done" && (
          <a href={`/quiz/${lessonId}?marks=40`}
            style={{ display: "inline-block", marginTop: "0.25rem", fontSize: "0.75rem", color: "#4ade80", fontFamily: "'DM Mono', monospace" }}>
            → Test yourself (40 marks)
          </a>
        )}
        {data.status === "mastered" && (
          <a href={`/quiz/${lessonId}?marks=80`}
            style={{ display: "inline-block", marginTop: "0.25rem", fontSize: "0.75rem", color: "#c084fc", fontFamily: "'DM Mono', monospace" }}>
            → Full test (80 marks)
          </a>
        )}
      </div>
    );
  };

  const renderNode = (node) => {
    if (Array.isArray(node)) {
      return node.map((lesson) => {
        const name = typeof lesson === "string" ? lesson : lesson.name;
        const meta = typeof lesson === "string" ? {} : lesson;
        return renderLesson(name, meta);
      });
    }
    return Object.entries(node).map(([key, value]) => {
      const completed = countCompletedLessons(value);
      const total = SUBJECT_TOTALS[currentClass]?.[key] ?? getTotalLessons(value);
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

      return (
        <div key={key} style={{ marginLeft: "0.75rem", marginTop: "0.75rem" }}>
          <button onClick={() => toggle(key)} style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            background: "none", border: "none", cursor: "pointer",
            width: "100%", padding: "0.4rem 0",
          }}>
            <span style={{ color: open[key] ? "#f59e0b" : "#475569", fontSize: "0.6rem", transition: "color 0.2s" }}>
              {open[key] ? "▼" : "▶"}
            </span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: "#dde3f0" }}>{key}</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#6b7aaa", marginLeft: "auto" }}>
              {completed}/{total}
            </span>
          </button>
          {open[key] || (search && nodeHasMatch(value, search)) ? (
            <div style={{ paddingLeft: "0.5rem", borderLeft: "1px solid #1e2535", marginLeft: "0.4rem" }}>
              {renderNode(value)}
            </div>
          ) : null}
        </div>
      );
    });
  };

  /* ---- overall progress ---- */
  const currentSyllabus = syllabus[currentClass] || {};
  const totalAll = Object.values(currentSyllabus).reduce((s, v) => s + getTotalLessons(v), 0);
  const doneAll = Object.values(currentSyllabus).reduce((s, v) => s + countCompletedLessons(v), 0);
  const overallPct = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }

        body {
          background: #0f1117 !important;
          background-image: radial-gradient(ellipse 70% 40% at 50% -5%, rgba(251,191,36,0.07), transparent) !important;
        }

        .subject-card {
          background: #1c1f2e;
          border: 1px solid #2e3450;
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }
        .subject-card:hover { border-color: #4a5580; background: #20243a; }

        .subject-header {
          display: flex;
          align-items: center;
          padding: 1.1rem 1.4rem;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          gap: 0.75rem;
        }
        .subject-header:hover .subject-icon { opacity: 1; }

        .progress-bar-track {
          height: 4px;
          background: #2a2f48;
          border-radius: 0;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          border-radius: 0;
          transition: width 0.6s ease;
        }

        .class-btn {
          padding: 6px 20px;
          border-radius: 6px;
          border: 1px solid #2e3450;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: all 0.15s ease;
          background: transparent;
          color: #7a8aaa;
        }
        .class-btn.active {
          background: #1e2d50;
          border-color: #4a6aaa;
          color: #93c5fd;
        }
        .class-btn:hover:not(.active) { border-color: #4a5580; color: #a0aec0; }

        .search-input {
          width: 100%;
          background: #1c1f2e;
          border: 1px solid #2e3450;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #e2e8f0;
          font-family: 'DM Mono', monospace;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: #3b5099; }
        .search-input::placeholder { color: #2d3748; }

        .save-btn {
          padding: 7px 20px;
          border-radius: 6px;
          border: 1px solid #44401030;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
          background: #1a1500;
          color: #f59e0b;
        }
        .save-btn.flashing {
          background: #f59e0b;
          color: #000;
          border-color: #f59e0b;
        }

        .reset-btn {
          padding: 7px 20px;
          border-radius: 6px;
          border: 1px solid #1e2535;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: all 0.15s ease;
          background: transparent;
          color: #7a8aaa;
        }
        .reset-btn:hover { border-color: #ef4444; color: #ef4444; }
      `}</style>

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#f1f5f9",
              margin: 0,
              letterSpacing: "-0.01em",
            }}>Study Tracker</h1>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              color: "#f59e0b",
              background: "#1a1500",
              border: "1px solid #f59e0b30",
              borderRadius: "4px",
              padding: "2px 8px",
            }}>CLASS {currentClass}</span>
          </div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontStyle: "normal", color: "#6b7aaa", margin: 0, fontSize: "0.9rem", fontWeight: 400 }}>
            {doneAll} of {totalAll} lessons completed
          </p>

          {/* Overall progress bar */}
          <div style={{ marginTop: "0.75rem" }}>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          {CLASSES.map((cls) => (
            <button key={cls} className={`class-btn${currentClass === cls ? " active" : ""}`}
              onClick={() => setCurrentClass(cls)}>
              Class {cls}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
            <button className={`save-btn${saveFlash ? " flashing" : ""}`} onClick={saveProgress}>
              {saveFlash ? "✓ Saved" : "Save"}
            </button>
            <button className="reset-btn" onClick={resetProgress}>Reset</button>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: "1.5rem", position: "relative" }}>
          <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#4a5270", fontSize: "0.85rem" }}>⌕</span>
          <input
            className="search-input"
            style={{ paddingLeft: "2.25rem" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lessons..."
          />
        </div>

        {/* Subject cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {Object.entries(currentSyllabus).map(([subjectName, subjectData]) => {
            const completed = countCompletedLessons(subjectData);
            const total = SUBJECT_TOTALS[currentClass]?.[subjectName] ?? getTotalLessons(subjectData);
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const icon = SUBJECT_ICONS[subjectName] ?? "📌";
            const isOpen = open[subjectName] || (search && nodeHasMatch(subjectData, search));

            return (
              <div key={subjectName} className="subject-card">
                {/* Subject header */}
                <button className="subject-header" onClick={() => toggle(subjectName)}>
                  <span className="subject-icon" style={{ fontSize: "1.1rem", opacity: 0.7, transition: "opacity 0.2s" }}>{icon}</span>
                  <span style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#f1f5f9",
                    letterSpacing: "0.01em",
                  }}>{subjectName}</span>

                  {/* mini progress bar */}
                  <div style={{ flex: 1, margin: "0 1rem" }}>
                    <div style={{ height: "4px", background: "#2e3450", borderRadius: "2px" }}>
                      <div style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: pct === 100 ? "#22c55e" : "linear-gradient(90deg, #f59e0b80, #f59e0b)",
                        borderRadius: "2px",
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                  </div>

                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: pct === 100 ? "#4ade80" : "#8892aa", whiteSpace: "nowrap" }}>
                    {completed}/{total}
                  </span>
                  <span style={{ color: isOpen ? "#f59e0b" : "#334155", fontSize: "0.6rem", marginLeft: "0.5rem", transition: "color 0.2s" }}>
                    {isOpen ? "▲" : "▼"}
                  </span>
                </button>

                {/* Thin gold line under header when open */}
                {isOpen && <div style={{ height: "1px", background: "linear-gradient(90deg, #f59e0b30, transparent)" }} />}

                {/* Subject content */}
                {isOpen && (
                  <div style={{ padding: "0.75rem 1rem 1rem" }}>
                    {renderNode(subjectData)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
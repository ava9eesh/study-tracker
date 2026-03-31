"use client";

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function ModeSelector({ user, onDone }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          settings: {
            class: selected,
            track: "Board",
          },
        },
        { merge: true }
      );
      onDone();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const classes = [
    { id: "9th", label: "9th Grade", available: true },
    { id: "10th", label: "10th Grade", available: false },
    { id: "11th", label: "11th Grade", available: false },
    { id: "12th", label: "12th Grade", available: false },
  ];

  const tracks = [
    { id: "Board", label: "Board Exam", available: true },
    { id: "JEE", label: "JEE Prep", available: false },
    { id: "NEET", label: "NEET Prep", available: false },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative"
    }}>
      <style>{`
        .choice-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          border: 2px solid;
          background: transparent;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s var(--ease-smooth);
          position: relative;
          overflow: hidden;
        }

        .choice-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent);
          transition: left 0.5s;
        }

        .choice-btn:hover::before {
          left: 100%;
        }

        .choice-btn.available {
          border-color: var(--border-medium);
          color: var(--text-secondary);
        }

        .choice-btn.available:hover {
          border-color: var(--accent-amber);
          color: var(--accent-amber);
          transform: translateY(-2px);
          box-shadow: 0 0 20px var(--accent-amber-glow);
        }

        .choice-btn.selected {
          border-color: var(--accent-amber);
          background: var(--accent-amber-glow);
          color: var(--accent-amber);
          box-shadow: 0 0 30px var(--accent-amber-glow);
        }

        .choice-btn.disabled {
          border-color: var(--border-subtle);
          color: var(--text-ghost);
          cursor: not-allowed;
          opacity: 0.4;
        }
      `}</style>

      <div
        className="glass"
        style={{
          maxWidth: "480px",
          width: "100%",
          padding: "2.5rem",
          borderRadius: "20px",
          animation: "scaleIn 0.5s var(--ease-spring)"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: "60px",
            height: "60px",
            margin: "0 auto 1rem",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            boxShadow: "0 10px 30px rgba(251, 191, 36, 0.3)"
          }}>
            🎓
          </div>
          <h1 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "2rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
            letterSpacing: "-0.02em"
          }}>
            Setup Your Profile
          </h1>
          <p style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: "1rem",
            color: "var(--text-tertiary)",
            fontStyle: "italic"
          }}>
            Tell us about your academic journey
          </p>
        </div>

        {/* Class Selection */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span>📚</span>
            Select Your Class
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.75rem"
          }}>
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => cls.available && setSelected(cls.id)}
                disabled={!cls.available}
                className={`choice-btn ${
                  cls.available ? "available" : "disabled"
                } ${selected === cls.id ? "selected" : ""}`}
              >
                {cls.label}
                {!cls.available && " 🚧"}
              </button>
            ))}
          </div>
        </div>

        {/* Track Selection (shown only after class selection) */}
        {selected && (
          <div
            style={{
              marginBottom: "2rem",
              animation: "fadeInUp 0.3s ease-out"
            }}
          >
            <h2 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <span>🎯</span>
              Choose Your Track
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "0.75rem"
            }}>
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => track.available && save()}
                  disabled={!track.available || loading}
                  className={`choice-btn ${
                    track.available ? "available" : "disabled"
                  }`}
                >
                  {loading && track.available ? (
                    <>
                      <span style={{ marginRight: "0.5rem" }}>⏳</span>
                      Setting up...
                    </>
                  ) : (
                    <>
                      {track.label}
                      {!track.available && " 🚧"}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info Note */}
        <div style={{
          padding: "1rem",
          background: "rgba(251, 191, 36, 0.05)",
          border: "1px solid rgba(251, 191, 36, 0.2)",
          borderRadius: "10px",
          marginTop: "1.5rem"
        }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.8125rem",
            color: "var(--text-tertiary)",
            margin: 0,
            lineHeight: 1.5
          }}>
            💡 More classes and tracks coming soon! Currently, only 9th Grade Board track is available.
          </p>
        </div>
      </div>
    </div>
  );
}
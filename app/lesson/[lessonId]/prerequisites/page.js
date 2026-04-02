"use client";

import { useParams } from "next/navigation";
import { syllabus } from "../../../../data/syllabus";
import { useEffect, useState } from "react";

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const flatten = (node) => {
  if (Array.isArray(node)) return node;
  if (typeof node === "object" && node !== null) {
    return Object.values(node).flatMap(flatten);
  }
  return [];
};

export default function PrerequisitesPage() {
  const { lessonId } = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const lessons = flatten(syllabus);

  const lesson = lessons.find(
    (l) =>
      typeof l === "object" &&
      l.name &&
      slugify(l.name) === lessonId
  );

  const lessonName = lesson?.name || lessonId?.replaceAll("-", " ");
  const prerequisites = lesson?.prerequisites ?? [
    "No prerequisites added for this lesson yet.",
  ];

  return (
    <>
      <style>{`
        .prereq-item {
          position: relative;
          padding-left: 2rem;
        }

        .prereq-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.5rem;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-amber);
          box-shadow: 0 0 12px var(--accent-amber-glow);
        }

        .prereq-item::after {
          content: '';
          position: absolute;
          left: 3.5px;
          top: 1.25rem;
          width: 1px;
          height: calc(100% - 0.5rem);
          background: linear-gradient(180deg, var(--accent-amber), transparent);
        }

        .prereq-item:last-child::after {
          display: none;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <main style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2.5rem 1.5rem 5rem",
        position: "relative",
        zIndex: 10
      }}>
        {/* Hero Header */}
        <div
          className="glass-card"
          style={{
            padding: "2.5rem 2rem",
            marginBottom: "2.5rem",
            textAlign: "center",
            animation: "scaleIn 0.5s var(--ease-spring)"
          }}
        >
          <div style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 1.5rem",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            boxShadow: "0 10px 30px rgba(251, 191, 36, 0.3)",
            animation: "pulse 2s ease-in-out infinite"
          }}>
            📋
          </div>

          <h1 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "2rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em"
          }}>
            Prerequisites
          </h1>

          <p style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: "1.125rem",
            color: "var(--text-tertiary)",
            fontStyle: "italic",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Essential knowledge you need before diving into this lesson
          </p>
        </div>

        {/* Lesson Info */}
        <div
          className="glass-card"
          style={{
            padding: "1.5rem 2rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            animation: "fadeInUp 0.5s ease-out 0.1s backwards"
          }}
        >
          <span style={{
            fontSize: "2rem",
            filter: "grayscale(0)"
          }}>
            📚
          </span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.25rem"
            }}>
              Current Lesson
            </div>
            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              textTransform: "capitalize"
            }}>
              {lessonName}
            </div>
          </div>
        </div>

        {/* Prerequisites List */}
        <div
          className="glass-card"
          style={{
            padding: "2rem",
            animation: "fadeInUp 0.5s ease-out 0.2s backwards"
          }}
        >
          <h2 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}>
            <span style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "var(--accent-amber-glow)",
              border: "1px solid var(--accent-amber)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem"
            }}>
              ✓
            </span>
            What You Should Know
          </h2>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}>
            {prerequisites.map((prereq, i) => (
              <div
                key={i}
                className="prereq-item"
                style={{
                  animation: `slideInRight 0.4s ease-out ${0.3 + i * 0.1}s backwards`
                }}
              >
                <div style={{
                  padding: "1.25rem 1.5rem",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "12px",
                  transition: "all 0.2s var(--ease-smooth)"
                }}
                  className="clickable"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent-amber)";
                    e.currentTarget.style.transform = "translateX(8px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <p style={{
                    fontFamily: "'Crimson Pro', serif",
                    fontSize: "1.0625rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    margin: 0
                  }}>
                    {prereq}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State Enhancement */}
          {prerequisites.length === 1 && prerequisites[0].includes("No prerequisites") && (
            <div style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "rgba(34, 211, 238, 0.05)",
              border: "1px solid rgba(34, 211, 238, 0.2)",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎯</div>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.875rem",
                color: "var(--accent-cyan)",
                margin: 0
              }}>
                This lesson is beginner-friendly! Jump right in.
              </p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div style={{
          marginTop: "2rem",
          textAlign: "center",
          animation: "fadeIn 0.5s ease-out 0.5s backwards"
        }}>
          <button
            onClick={() => window.history.back()}
            className="btn-ghost"
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem"
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Tips Card */}
        <div
          className="glass-card"
          style={{
            marginTop: "2rem",
            padding: "1.5rem 2rem",
            background: "rgba(167, 139, 250, 0.05)",
            border: "1px solid rgba(167, 139, 250, 0.2)",
            animation: "fadeInUp 0.5s ease-out 0.4s backwards"
          }}
        >
          <div style={{
            display: "flex",
            gap: "1rem",
            alignItems: "flex-start"
          }}>
            <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>💡</span>
            <div>
              <h3 style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--accent-violet)",
                marginBottom: "0.5rem"
              }}>
                Pro Tip
              </h3>
              <p style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: "0.9375rem",
                color: "var(--text-tertiary)",
                lineHeight: 1.6,
                margin: 0
              }}>
                Make sure you're comfortable with these concepts before proceeding. A strong foundation makes learning new material much easier!
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
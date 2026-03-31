"use client";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import Dashboard from "./Dashboard";
import { useEffect, useState } from "react";

export default function LoginGate() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Animated Background Orbs */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "float 20s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 25s ease-in-out infinite reverse"
        }} />

        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(30px, -30px); }
            50% { transform: translate(-20px, 20px); }
            75% { transform: translate(20px, 10px); }
          }

          @keyframes shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.3), 0 0 40px rgba(251, 191, 36, 0.1); }
            50% { box-shadow: 0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.2); }
          }
        `}</style>

        <div
          className="glass"
          style={{
            maxWidth: "440px",
            width: "100%",
            padding: "3rem 2.5rem",
            borderRadius: "20px",
            textAlign: "center",
            position: "relative",
            zIndex: 10,
            animation: "fadeInUp 0.8s ease-out"
          }}
        >
          {/* Logo/Icon */}
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
            animation: "pulse-glow 3s ease-in-out infinite"
          }}>
            📚
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "2.5rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
            animation: "shimmer 3s ease-in-out infinite"
          }}>
            Study Tracker
          </h1>

          <p style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: "1.125rem",
            color: "var(--text-tertiary)",
            marginBottom: "2.5rem",
            fontStyle: "italic",
            lineHeight: 1.6
          }}>
            Your personal companion for academic excellence. Track progress, master concepts, and achieve your goals.
          </p>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "1rem 2rem",
              fontSize: "1rem",
              marginBottom: "1.5rem",
              position: "relative",
              overflow: "hidden",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? (
              <>
                <span style={{ marginRight: "0.5rem" }}>⏳</span>
                Signing in...
              </>
            ) : (
              <>
                <span style={{ marginRight: "0.75rem" }}>🔐</span>
                Continue with Google
              </>
            )}
          </button>

          {/* Footer Info */}
          <div style={{
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-subtle)"
          }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              marginBottom: "0.5rem"
            }}>
              Built with ❤️ by Team Study Tracker
            </p>
            <a
              href="mailto:studytracker@yahoo.com"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8125rem",
                color: "var(--accent-cyan)",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.textShadow = "0 0 8px currentColor"}
              onMouseLeave={(e) => e.currentTarget.style.textShadow = "none"}
            >
              studytracker@yahoo.com
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => signOut(auth)}
        className="btn-ghost"
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 1000,
          padding: "0.625rem 1.25rem",
          fontSize: "0.8125rem",
          color: "#ef4444",
          borderColor: "rgba(239, 68, 68, 0.2)"
        }}
      >
        <span style={{ marginRight: "0.5rem" }}>🚪</span>
        Logout
      </button>
      <Dashboard user={user} />
    </>
  );
}
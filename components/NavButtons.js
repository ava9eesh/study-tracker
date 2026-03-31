"use client";

import { useEffect, useState } from "react";

export default function NavButtons() {
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    const update = () => {
      setCanGoBack(window.history.length > 1);
      setCanGoForward(true); // Browser handles this internally
    };
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  return (
    <>
      <style>{`
        .nav-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          color: var(--text-secondary);
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.2s var(--ease-smooth);
          box-shadow: var(--shadow-md);
        }

        .nav-btn:hover:not(:disabled) {
          background: var(--bg-elevated);
          border-color: var(--accent-amber);
          color: var(--accent-amber);
          transform: translateY(-2px);
          box-shadow: 0 0 20px var(--accent-amber-glow), var(--shadow-lg);
        }

        .nav-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-container {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.75rem;
          z-index: 1000;
          animation: slideUp 0.5s var(--ease-smooth);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>

      <div className="nav-container">
        <button
          className="nav-btn"
          onClick={() => canGoBack && window.history.back()}
          disabled={!canGoBack}
          title="Go Back"
          aria-label="Navigate back"
        >
          ←
        </button>
        <button
          className="nav-btn"
          onClick={() => window.history.forward()}
          disabled={!canGoForward}
          title="Go Forward"
          aria-label="Navigate forward"
        >
          →
        </button>
      </div>
    </>
  );
}
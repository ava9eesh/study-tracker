"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NavButtons() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    const update = () => {
      setCanGoBack(window.history.length > 1);
      // No reliable API for forward — show it always, browser handles it
      setCanGoForward(true);
    };
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  const btnStyle = (active) => ({
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid #2e3450",
    background: active ? "#1c1f2e" : "transparent",
    color: active ? "#a0aec0" : "#2e3450",
    cursor: active ? "pointer" : "default",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
    fontFamily: "'DM Mono', monospace",
  });

  return (
    <div style={{
      position: "fixed",
      top: "12px",
      left: "14px",
      display: "flex",
      gap: "6px",
      zIndex: 1000,
    }}>
      <button
        onClick={() => canGoBack && window.history.back()}
        style={btnStyle(canGoBack)}
        title="Go back"
        onMouseEnter={(e) => { if (canGoBack) e.currentTarget.style.borderColor = "#6b7aaa"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2e3450"; }}
      >
        ←
      </button>
      <button
        onClick={() => window.history.forward()}
        style={btnStyle(canGoForward)}
        title="Go forward"
        onMouseEnter={(e) => { if (canGoForward) e.currentTarget.style.borderColor = "#6b7aaa"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2e3450"; }}
      >
        →
      </button>
    </div>
  );
}

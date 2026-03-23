import LoginGate from "@/components/LoginGate";

export default function Page() {
  return (
    <>
      {/* Beta disclaimer banner */}
      <div style={{
        background: "#1a1500",
        borderBottom: "1px solid #f59e0b30",
        padding: "10px 1.25rem",
        textAlign: "center",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.75rem",
        color: "#a0824a",
        lineHeight: "1.6",
      }}>
        <span style={{ color: "#f59e0b", fontWeight: 600, marginRight: "0.4rem" }}>⚠ BETA</span>
        MCQs may contain errors — use them as a study aid, not a final reference.
        Found a bug?{" "}
        <a
          href="mailto:studytracker@yahoo.com"
          style={{ color: "#f59e0b", textDecoration: "none", borderBottom: "1px solid #f59e0b50" }}
        >
          studytracker@yahoo.com
        </a>
      </div>

      <LoginGate />

      <footer style={{
        textAlign: "center",
        fontSize: "0.75rem",
        color: "#4a5270",
        marginTop: "4rem",
        paddingBottom: "2rem",
        fontFamily: "'DM Mono', monospace",
        lineHeight: "1.8",
      }}>
        Built by Team Study Tracker <br />
        Contact: <a href = "mailto:studytracker@yahoo.com">studytracker@yahoo.com</a>
      </footer>
    </>
  );
}
import LoginGate from "@/components/LoginGate";

export default function Page() {
  return (
    <>
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
        <span style={{ color: "#f59e0b", fontWeight: 600 }}>⚠ BETA</span>
        {" "}MCQs may contain errors — use them as a study aid.

        <br />

        <a href="mailto:support@studytracker.tech">
          support@studytracker.tech
        </a>

        <br /><br />

        <a 
  href="/qr.jpg" 
  target="_blank" 
  rel="noopener noreferrer"
  style={{
    display: "inline-block",
    marginTop: "12px",
    padding: "8px 14px",
    background: "#f59e0b",
    color: "#000",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600"
  }}
>
  💸 Support Us
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
      }}>
        Built by Team Study Tracker <br />
        Contact: <a href="mailto:support@studytracker.tech">support@studytracker.tech</a>
      </footer>
    </>
  );
}
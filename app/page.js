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

        <a href="mailto:studytracker@yahoo.com">
          studytracker@yahoo.com
        </a>

        <br /><br />

        <a href="/qr.jpg" target="_blank" rel="noopener noreferrer">
          <img src="/qr.jpg" width="200" alt="Scan to pay" />
          <div>Support us with a donation 💸</div>
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
        Contact: <a href="mailto:studytracker@yahoo.com">studytracker@yahoo.com</a>
      </footer>
    </>
  );
}
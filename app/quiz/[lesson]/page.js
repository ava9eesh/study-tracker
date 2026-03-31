import { Suspense } from "react";
import QuizPage from "@/components/QuizPage";

export default async function Page({ params }) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        background: "#080a10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.8rem",
        color: "#2e3450",
        letterSpacing: "0.1em",
      }}>
        LOADING...
      </div>
    }>
      <QuizPage initialLesson={resolvedParams?.lesson} />
    </Suspense>
  );
}
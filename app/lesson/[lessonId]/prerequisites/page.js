import { syllabus } from "@/data/syllabus";

export default function PrerequisitesPage({ params }) {
  const { lessonId } = params;

  const lesson = Object.values(syllabus)
    .flat()
    .find((l) => {
      const name = typeof l === "string" ? l : l.name;
      return (
        name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "") === lessonId
      );
    });

  const prerequisites =
    typeof lesson === "object" && lesson.prerequisites
      ? lesson.prerequisites
      : [
          "Revise previous chapters",
          "Understand basic definitions",
          "Know important keywords",
        ];

  return (
    <main className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Previous Knowledge Required
      </h1>

      <ul className="list-disc ml-6 space-y-2 text-gray-200">
        {prerequisites.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-gray-400">
        Lesson: {lessonId.replaceAll("-", " ")}
      </p>
    </main>
  );
}

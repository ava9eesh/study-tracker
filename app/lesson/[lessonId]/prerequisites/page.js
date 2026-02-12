import { syllabus } from "@/data/syllabus";

function flattenSyllabus(node) {
  if (Array.isArray(node)) return node;
  if (typeof node === "object" && node !== null) {
    return Object.values(node).flatMap(flattenSyllabus);
  }
  return [];
}

export default function PrerequisitesPage({ params }) {
  const lessonId = params?.lessonId || "";

  const allLessons = flattenSyllabus(syllabus);

  const lessonObj = allLessons.find((l) => {
    if (typeof l === "string") return false;
    if (!l.name) return false;

    return (
      l.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "") === lessonId
    );
  });

  const prerequisites =
    lessonObj?.prerequisites ??
    [
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

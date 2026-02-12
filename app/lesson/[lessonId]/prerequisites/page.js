import { syllabus } from "@/data/syllabus";

function flatten(node) {
  if (Array.isArray(node)) return node;
  if (typeof node === "object" && node !== null)
    return Object.values(node).flatMap(flatten);
  return [];
}

export default function PrerequisitesPage({ params }) {
  const lessonId = params?.lessonId ?? "";

  const lessons = flatten(syllabus);

  const lesson = lessons.find(
    (l) =>
      typeof l === "object" &&
      l.name &&
      l.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "") === lessonId
  );

  const prerequisites =
    lesson?.prerequisites ?? [
      "No prerequisites added for this lesson yet.",
    ];

  return (
    <main className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Previous Knowledge Required
      </h1>

      <ul className="list-disc ml-6 space-y-2 text-gray-200">
        {prerequisites.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-gray-400">
        Lesson: {lessonId.replaceAll("-", " ")}
      </p>
    </main>
  );
}

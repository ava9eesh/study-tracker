import { syllabus } from "@/data/syllabus";

const slugify = (s) =>
  s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

const flatten = (node) =>
  Array.isArray(node)
    ? node
    : Object.values(node).flatMap(flatten);

export default function PrerequisitesPage({ params }) {
  const lessonId = params.lessonId;

  const lessons = flatten(syllabus);

  const lesson = lessons.find(
    (l) => typeof l === "object" && slugify(l.name) === lessonId
  );

  return (
    <main className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Previous Knowledge Required
      </h1>

      <ul className="list-disc ml-6 space-y-2">
        {(lesson?.prerequisites ?? ["No prerequisites added yet."])
          .map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </main>
  );
}

"use client";

import { useParams } from "next/navigation";
import { syllabus } from "@/data/syllabus";

// slug helper — SAME LOGIC EVERYWHERE
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const flatten = (node) => {
  if (Array.isArray(node)) return node;
  if (typeof node === "object" && node !== null) {
    return Object.values(node).flatMap(flatten);
  }
  return [];
};

export default function PrerequisitesPage() {
  const { lessonId } = useParams(); // ✅ THIS IS THE KEY FIX

  const lessons = flatten(syllabus);

  const lesson = lessons.find(
    (l) =>
      typeof l === "object" &&
      l.name &&
      slugify(l.name) === lessonId
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

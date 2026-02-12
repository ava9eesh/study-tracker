export default function LessonCard({ lesson, data, onChange }) {
  const update = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const lessonId = lesson
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  const status = data?.status;

  return (
    <div className="bg-zinc-900 p-4 rounded-lg mb-3">
      <h3 className="font-semibold mb-2">{lesson}</h3>

      {/* STATUS */}
      <div className="flex gap-2 mb-2">
        {["todo", "doing", "done", "mastered"].map(s => (
          <button
            key={s}
            onClick={() => update("status", s)}
            className={`px-2 py-1 rounded text-sm ${
              status === s ? "bg-blue-600" : "bg-zinc-700"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* COUNTERS */}
      <div className="flex gap-4 mb-2 text-sm">
        <label>
          Revisions:
          <input
            type="number"
            min="0"
            max="100"
            value={data.revisions}
            onChange={e => update("revisions", +e.target.value)}
            className="ml-2 w-16 bg-black"
          />
        </label>

        <label>
          PYQs:
          <input
            type="number"
            min="0"
            max="100"
            value={data.pyqs}
            onChange={e => update("pyqs", +e.target.value)}
            className="ml-2 w-16 bg-black"
          />
        </label>
      </div>

      {/* LINKS */}
      <div className="text-sm space-y-1">
        <input
          placeholder="Lesson video link"
          value={data.links.video}
          onChange={e =>
            update("links", { ...data.links, video: e.target.value })
          }
          className="w-full bg-black p-1"
        />
        <input
          placeholder="PYQs link"
          value={data.links.pyqs}
          onChange={e =>
            update("links", { ...data.links, pyqs: e.target.value })
          }
          className="w-full bg-black p-1"
        />
      </div>

      {/* 🔥 STATUS ACTION (CLEAR + VISIBLE) */}
      {status === "todo" && (
        <a
          href={`/lesson/${lessonId}/prerequisites`}
          className="block mt-3 text-blue-400 font-medium hover:underline"
        >
          → Previous Knowledge Required
        </a>
      )}

      {status === "done" && (
        <a
          href={`/quiz/${lessonId}?marks=40`}
          className="block mt-3 text-green-400 font-medium hover:underline"
        >
          → Done? Let’s test (40 marks)
        </a>
      )}

      {status === "mastered" && (
        <a
          href={`/quiz/${lessonId}?marks=80`}
          className="block mt-3 text-purple-400 font-medium hover:underline"
        >
          → Mastered? Let’s see (80 marks)
        </a>
      )}
    </div>
  );
}

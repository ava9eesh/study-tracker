export default function ClassSelector({ onSelect }) {
  const classes = [
    { name: "9th", enabled: true },
    { name: "10th", enabled: false },
    { name: "11th", enabled: false },
    { name: "12th", enabled: false },
    { name: "JEE", enabled: false },
    { name: "NEET", enabled: false },
  ];

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded text-white">
        <h2 className="mb-4 text-xl">Select your class</h2>

        <div className="grid grid-cols-2 gap-3">
          {classes.map((c) => (
            <button
              key={c.name}
              disabled={!c.enabled}
              onClick={() => c.enabled && onSelect(c.name)}
              className={`px-4 py-2 rounded ${
                c.enabled
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-zinc-700 cursor-not-allowed"
              }`}
            >
              {c.name} {!c.enabled && "🚧"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

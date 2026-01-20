"use client";

export default function ClassSelector({ onSelect }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="glass p-6 rounded-xl w-[320px] space-y-5">
        <h2 className="text-lg font-semibold text-center">
          Select your class
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* 9th */}
          <button
            onClick={() => onSelect("9th")}
            className="bg-blue-600 hover:bg-blue-700 transition py-2 rounded font-medium"
          >
            9th
          </button>

          {/* Disabled */}
          {["10th", "11th", "12th", "JEE / NEET"].map((cls) => (
            <button
              key={cls}
              disabled
              className="bg-zinc-800 text-gray-400 py-2 rounded cursor-not-allowed"
            >
              {cls} 🚧
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function ModeSelector({ user, onDone }) {
  const selectMode = async () => {
    await setDoc(doc(db, "users", user.uid), {
      settings: {
        class: "9th",
        track: "Board",
      },
    }, { merge: true });

    onDone();
  };

  const Disabled = ({ label }) => (
    <button
      className="px-4 py-2 rounded bg-zinc-800 text-zinc-400 cursor-not-allowed"
      title="Under construction"
    >
      {label} 🚧
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-xl w-[360px] space-y-6">

        <h1 className="text-xl font-bold text-center">
          Select your class
        </h1>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={selectMode}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
          >
            9th
          </button>

          <Disabled label="10th" />
          <Disabled label="11th" />
          <Disabled label="12th" />
        </div>

        <hr className="border-zinc-800" />

        <h2 className="text-lg font-semibold text-center">
          Track
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <button className="px-3 py-2 rounded bg-blue-600">
            Board
          </button>

          <Disabled label="JEE" />
          <Disabled label="NEET" />
        </div>

        <p className="text-xs text-center text-zinc-400">
          Other classes & exams coming soon
        </p>
      </div>
    </div>
  );
}

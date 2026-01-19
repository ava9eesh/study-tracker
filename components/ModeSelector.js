"use client";

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function ModeSelector({ user, onDone }) {
  const [selected, setSelected] = useState(null);

  const save = async () => {
    await setDoc(
      doc(db, "users", user.uid),
      {
        settings: {
          class: "9th",
          track: "Board",
        },
      },
      { merge: true }
    );

    onDone();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-6 rounded-xl w-[320px] space-y-6">

        <h1 className="text-xl font-bold text-center">
          Select your class
        </h1>

        {/* CLASS BUTTONS */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelected("9th")}
            className={`py-2 rounded text-center transition
              ${selected === "9th"
                ? "bg-blue-600"
                : "bg-zinc-700 hover:bg-zinc-600"}
            `}
          >
            9th
          </button>

          <button disabled className="py-2 rounded bg-zinc-800 text-zinc-400">
            10th 🚧
          </button>

          <button disabled className="py-2 rounded bg-zinc-800 text-zinc-400">
            11th 🚧
          </button>

          <button disabled className="py-2 rounded bg-zinc-800 text-zinc-400">
            12th 🚧
          </button>
        </div>

        {/* TRACK */}
        {selected && (
          <>
            <h2 className="text-lg font-semibold text-center">
              Track
            </h2>

            <button
              onClick={save}
              className="w-full py-2 bg-blue-600 rounded hover:bg-blue-500 transition"
            >
              Board
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button disabled className="py-2 rounded bg-zinc-800 text-zinc-400">
                JEE 🚧
              </button>
              <button disabled className="py-2 rounded bg-zinc-800 text-zinc-400">
                NEET 🚧
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";

export default function LoginGate() {
  const [user, setUser] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // TEMP: fake logged-in user (since Google login is unstable now)
  useEffect(() => {
    setUser({ name: "Avaneesh" });
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!selectedClass) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-zinc-900 p-6 rounded-xl text-white">
          <h2 className="text-xl mb-4">Select your class</h2>
          <div className="grid grid-cols-2 gap-3">
            {["9th", "10th", "11th", "12th"].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className="bg-zinc-800 hover:bg-blue-600 px-4 py-2 rounded"
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ✅ THIS WAS MISSING / BROKEN
  return <Dashboard selectedClass={selectedClass} />;
}

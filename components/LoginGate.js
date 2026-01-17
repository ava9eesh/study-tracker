"use client";

import { useState, useEffect } from "react";
import {
  signInAnonymously,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import Dashboard from "./Dashboard";

export default function LoginGate() {
  const [name, setName] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
  }, []);

  const enter = async () => {
    if (!name.trim()) return;

    const result = await signInAnonymously(auth);
    await updateProfile(result.user, {
      displayName: name,
    });
  };

  if (user) {
    return <Dashboard user={user.uid} name={user.displayName} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="glass p-8 rounded-xl w-[320px]">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Study Tracker
        </h1>

        <input
          className="w-full p-2 rounded bg-zinc-800 mb-4 outline-none"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={enter}
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-500 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

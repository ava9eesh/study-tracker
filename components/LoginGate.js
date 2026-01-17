"use client";

const signup = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    setError(err.code); // shows exact Firebase error
    console.error(err);
  }
};

import { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import Dashboard from "./Dashboard";

export default function LoginGate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
  }, []);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Invalid login");
    }
  };

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Signup failed");
    }
  };

  if (user) return <Dashboard user={user.uid} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="glass p-8 rounded-xl w-[320px] text-white">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Study Tracker
        </h1>

        <input
          className="w-full p-2 mb-3 bg-zinc-800 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 mb-4 bg-zinc-800 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <button onClick={login} className="w-full bg-blue-600 py-2 rounded mb-2">
          Login
        </button>
        <button onClick={signup} className="w-full bg-gray-700 py-2 rounded">
          Sign Up
        </button>
      </div>
    </div>
  );
}

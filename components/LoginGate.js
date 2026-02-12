"use client";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import Dashboard from "./Dashboard";
import { useEffect, useState } from "react";

export default function LoginGate() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm text-center space-y-6 px-6">

        <h1 className="text-2xl font-semibold text-white">
          Study Tracker
        </h1>

        <button
          onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
          className="w-full bg-blue-600 py-3 rounded-xl text-white font-medium hover:bg-blue-500 transition"
        >
          Continue with Google
        </button>

        <p className="text-sm text-gray-400">
          Built by Avaneesh Shinde
          <br />
          Contact: <span className="text-blue-400">i_love_zandu_bam</span>
        </p>

      </div>
    </div>
  );
}


  return (
    <>
      <button
        onClick={() => signOut(auth)}
        className="absolute top-4 right-4 text-sm text-red-400"
      >
        Logout
      </button>
      <Dashboard user={user} />
    </>
  );
}

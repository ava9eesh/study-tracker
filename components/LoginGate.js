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
      <div className="h-screen flex items-center justify-center bg-black">
        <button
          onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
          className="px-6 py-3 bg-blue-600 rounded text-white"
        >
          Continue with Google
        </button>
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

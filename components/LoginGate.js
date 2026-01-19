"use client";

import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

export default function LoginGate() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <button
          onClick={() => signInWithPopup(auth, provider)}
          className="bg-blue-600 px-6 py-3 rounded"
        >
          Continue with Google
        </button>
      </div>
    );
  }

  return <Dashboard user={user} logout={() => signOut(auth)} />;
}

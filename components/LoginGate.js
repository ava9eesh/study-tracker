"use client";

import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

export default function LoginGate() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  if (user) {
    return <Dashboard user={user} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <button
        onClick={login}
        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500"
      >
        Continue with Google
      </button>
    </div>
  );
}

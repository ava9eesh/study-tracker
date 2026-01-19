"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useEffect, useState } from "react";

import Dashboard from "./Dashboard";
import ModeSelector from "./ModeSelector";

export default function LoginGate() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasMode, setHasMode] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setReady(true);
        return;
      }

      setUser(u);

      // 🔥 CHECK FIRESTORE ONCE
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists() && snap.data()?.settings) {
        setHasMode(true);
      }

      setReady(true);
    });

    return () => unsub();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  if (!ready) return null;

  if (!user) {
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

  if (!hasMode) {
    return (
      <ModeSelector
        user={user}
        onDone={() => setHasMode(true)}
      />
    );
  }

  return <Dashboard user={user} />;
}

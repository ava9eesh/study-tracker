"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useEffect, useState } from "react";

import Dashboard from "./Dashboard";
import ModeSelector from "./ModeSelector";

export default function LoginGate() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState("loading"); 
  // loading | mode | dashboard

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        setUser(null);
        setStep("login");
        return;
      }

      setUser(u);
      setStep("mode"); // always go to mode once
    });

    return () => unsub();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  if (step === "loading") return null;

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

  if (step === "mode") {
    return (
      <ModeSelector
        user={user}
        onDone={() => setStep("dashboard")}
      />
    );
  }

  return <Dashboard user={user} />;
}

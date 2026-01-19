"use client";

import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, provider } from "@/utils/firebase";
import { useEffect, useState } from "react";
import ClassSelector from "./ClassSelector";
import Dashboard from "./Dashboard";

export default function LoginGate() {
  const [user, setUser] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <button
          onClick={() => signInWithPopup(auth, provider)}
          className="bg-blue-600 px-6 py-3 rounded text-white"
        >
          Continue with Google
        </button>
      </div>
    );
  }

  if (!selectedClass) {
    return <ClassSelector onSelect={setSelectedClass} />;
  }

  return (
    <Dashboard
      user={user}
      selectedClass={selectedClass}
      logout={() => signOut(auth)}
    />
  );
}

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/* ---------------- USER SETTINGS ---------------- */

// Get user settings (class, track)
export const getUserSettings = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data().settings || null;
};

// Save user settings (class, track)
export const saveUserSettings = async (uid, settings) => {
  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    { settings },
    { merge: true }
  );
};

/* ---------------- PROGRESS ---------------- */

// Get progress for a class (e.g. 9th)
export const getProgress = async (uid, className) => {
  const ref = doc(db, "progress", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return {};
  return snap.data()?.[className] || {};
};

// Save progress for a class
export const saveProgress = async (uid, className, data) => {
  const ref = doc(db, "progress", uid);

  await setDoc(
    ref,
    {
      [className]: data,
    },
    { merge: true }
  );
};

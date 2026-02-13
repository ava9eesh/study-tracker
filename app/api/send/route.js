import webpush from "web-push";
import { NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";

function setupVapid() {
  webpush.setVapidDetails(
    "mailto:your@email.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

const messages = [
  "Did you study enough? Nothing is enough.",
  "3 hours passed. Go again.",
  "Your goals are watching.",
  "Future you is waiting.",
  "No excuses. Open a book."
];

export async function GET() {
  setupVapid();

  const snapshot = await getDocs(collection(db, "subscriptions"));

  const payload = JSON.stringify({
    title: "Study Reminder 🔥",
    body: messages[Math.floor(Math.random() * messages.length)],
  });

  for (const doc of snapshot.docs) {
    try {
      await webpush.sendNotification(doc.data(), payload);
    } catch (err) {
      console.error("Push failed:", err);
    }
  }

  return NextResponse.json({ success: true });
}

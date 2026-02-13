import webpush from "web-push";
import { adminDb } from "@/utils/firebaseAdmin";
import { verifySignature } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";

function setupVapid() {
  webpush.setVapidDetails(
    "mailto:your@email.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

const messages = [
  "Did you study enough? Nothing is enough.",
  "3 hours passed. Open the app.",
  "Future you is watching.",
  "No excuses.",
];

export const GET = verifySignature(async () => {
  setupVapid();

  const snapshot = await adminDb.collection("subscriptions").get();

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
});

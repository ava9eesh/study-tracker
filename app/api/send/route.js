import webpush from "web-push";
import { adminDb } from "@/utils/firebaseAdmin";
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
});

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

export async function GET(req) {
  try {
    await receiver.verify({
      signature: req.headers.get("upstash-signature"),
      body: "",
    });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
}

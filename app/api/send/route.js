import webpush from "web-push";
import { NextResponse } from "next/server";
import { adminDb } from "@/utils/firebaseAdmin";

function setupVapid() {
  webpush.setVapidDetails(
    "mailto:your@email.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}


export async function GET() {
  setupVapid();

  const snapshot = await adminDb.collection("subscriptions").get();

  const messages = [
    "Did you study enough? Nothing is enough.",
    "3 hours passed. Open the app.",
    "Future you is watching.",
    "No excuses.",
  ];

  const payload = JSON.stringify({
    title: "Study Reminder 🔥",
    body: messages[Math.floor(Math.random() * messages.length)],
  });

  const promises = snapshot.docs.map((doc) =>
    webpush.sendNotification(doc.data(), payload)
  );

  await Promise.all(promises);

  return NextResponse.json({ success: true });
}

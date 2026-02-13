import webpush from "web-push";
import { adminDb } from "@/utils/firebaseAdmin";
import { NextResponse } from "next/server";
import crypto from "crypto";

function setupVapid() {
  webpush.setVapidDetails(
    "mailto:your@email.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

function verifyUpstashSignature(req) {
  const signature = req.headers.get("upstash-signature");
  const body = ""; // GET request has empty body

  const key = process.env.QSTASH_CURRENT_SIGNING_KEY;

  if (!signature || !key) return false;

  const hash = crypto
    .createHmac("sha256", key)
    .update(body)
    .digest("base64");

  return signature === hash;
}

const messages = [
  "Did you study enough? Nothing is enough.",
  "3 hours passed. Open the app.",
  "Future you is watching.",
  "No excuses.",
];

export async function GET(req) {
  if (!verifyUpstashSignature(req)) {
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

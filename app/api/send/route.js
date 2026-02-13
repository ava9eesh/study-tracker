import webpush from "web-push";
import { NextResponse } from "next/server";

webpush.setVapidDetails(
  "mailto:your@email.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function GET() {
  const fakeSubscription = {}; // replace with real DB

  const payload = JSON.stringify({
    title: "Did you study enough?",
    body: "Nothing is enough. Go again.",
  });

  try {
    await webpush.sendNotification(fakeSubscription, payload);
  } catch (err) {
    console.error(err);
  }

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:your@email.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(req) {
  const subscription = await req.json();

  // Save to database (for now just log)
  console.log("Subscription received:", subscription);

  return NextResponse.json({ success: true });
}

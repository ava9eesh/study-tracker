import { NextResponse } from "next/server";
import { adminDb } from "@/utils/firebaseAdmin";

export async function POST(req) {
  const subscription = await req.json();

  await adminDb.collection("subscriptions").add(subscription);

  console.log("Subscription saved to Firestore");

  return NextResponse.json({ success: true });
}

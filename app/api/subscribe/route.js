import { NextResponse } from "next/server";
import { db } from "@/utils/firebase"; // adjust if needed
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  const subscription = await req.json();

  try {
    await addDoc(collection(db, "subscriptions"), subscription);
    console.log("Subscription saved");
  } catch (err) {
    console.error(err);
  }

  return NextResponse.json({ success: true });
}

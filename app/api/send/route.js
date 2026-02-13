import webpush from "web-push";
import { NextResponse } from "next/server";

webpush.setVapidDetails(
  "mailto:your@email.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function GET() {
    setupVapid();
    
  const subscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/dZBpOcuUcwE:APA91bHll86x1v4Rugx3wuUqgkXOTNpPvHdx-Gk4OShdsxIV6Ksst2V04OHVywlbBvyZNM7vueTDxkfxsxLofasH6E3p-zCOk67jk2tu0qq_JpmOLYiXiCmduoB4XeJdpDwAtSD5BxBi",
  keys: {
    p256dh: "BHjt-DIVhPuBl9wD_AtDfaaUscy4oLXIT60MoU36mdPJI-JPyaCM3n043ItgjRjhOZbqiCkEVJ9gVF1jmHang_Q",
    auth: "H6hgH-zEzFEln7z0M5pbhg",
  }
};


  const payload = JSON.stringify({
    title: "Did you study enough?",
    body: "Nothing is enough. Go again.",
  });

  try {
    await webpush.sendNotification(subscription, payload);
  } catch (err) {
    console.error(err);
  }

  return NextResponse.json({ success: true });
}

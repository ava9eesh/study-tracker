"use client";
import { useEffect } from "react";

const messages = [
  "Did you study enough? Because nothing is enough.",
  "Your goals don't care about your mood.",
  "3 hours passed. What did you learn?",
  "Small progress is still progress.",
  "Future you is watching.",
  "One more session. No excuses.",
];

export default function NotificationManager() {
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          startReminders();
        }
      });
    }
  }, []);

  function startReminders() {
    setInterval(() => {
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

      new Notification("Study Reminder 🔥", {
        body: randomMessage,
        icon: "/icon-192.png",
      });
    }, 10000); // 10 seconds
  }

  return null;
}

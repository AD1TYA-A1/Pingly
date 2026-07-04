"use client";

import { useEffect } from "react";
import { requestNotificationPermission,onForegroundMessage } from "../lib/firebase-client";
import { toast } from "react-toastify"; // you already use react-toastify

export default function EnableNotifications() {
  useEffect(() => {
    const setupNotifications = async () => {
      const token = await requestNotificationPermission();

      if (token) {
        // Save token to backend
        await fetch("/api/save-fcm-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // sends your auth cookie
          body: JSON.stringify({ token }),
        });
      }
    };

    setupNotifications();

    // Listen for messages while app is OPEN and focused
    onForegroundMessage((payload) => {
      toast.info(payload.notification?.body || "New message received");
    });
  }, []);

  return null; // this component just runs logic, renders nothing
}
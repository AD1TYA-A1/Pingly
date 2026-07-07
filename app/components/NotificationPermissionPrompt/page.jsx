"use client";

import { useEffect, useState } from "react";
import { requestNotificationPermission } from "@/app/lib/firebase-client";

// How often to re-show the prompt if user dismisses it without deciding (ms)
const REMIND_AFTER_MS = 1 * 24 * 60 * 60 * 1000; // 3 days
const STORAGE_KEY = "notif_prompt_last_dismissed";

export default function NotificationPermissionPrompt() {
  const [visible, setVisible] = useState(false);
  const [permissionState, setPermissionState] = useState("default");
  const [saving, setSaving] = useState(false);


  useEffect(() => {

    console.log(permissionState);

  }, [permissionState])


  useEffect(() => {

    if (typeof window === "undefined" || !("Notification" in window)) return;

    const currentPermission = Notification.permission; // "default" | "granted" | "denied"
    setPermissionState(currentPermission);

    if (currentPermission === "granted") {
      setVisible(false);
      return;
    }

    // Check if we recently dismissed this — avoid nagging every page load
    const lastDismissed = localStorage.getItem(STORAGE_KEY);
    const shouldShow =
      !lastDismissed || Date.now() - Number(lastDismissed) > REMIND_AFTER_MS;

    if (shouldShow) {
      // Small delay so it doesn't pop instantly on page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  };

  const handleEnableClick = async () => {
    setSaving(true);
    const token = await requestNotificationPermission();
    console.log(token);
    
    setSaving(false);

    if (token) {
      // Success — permission granted and token saved
      setVisible(false);
      setPermissionState("granted");
    } else {
      // Either denied just now, or something failed — re-check actual state
      setPermissionState(Notification.permission);
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }
    handleDismiss()
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px]
                 bg-zinc-950 border border-amber-400 rounded-xl px-5 py-4
                 shadow-2xl shadow-black/50 z-[9999] text-white"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-[15px] font-semibold text-amber-400 m-0">
          Stay in the loop
        </h3>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="text-gray-400 hover:text-white text-lg leading-none bg-transparent border-none cursor-pointer"
        >
          ×
        </button>
      </div>

      {permissionState === "denied" ? (
        <>
          <p className="text-[13px] text-gray-300 mt-2 mb-3">
            Notifications are currently blocked. To get notified of new messages,
            enable them manually:
          </p>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Tap the lock/info icon next to the site address → Notifications → Allow
          </p>
        </>
      ) : (
        <p className="text-[13px] text-gray-300 mt-2 mb-3.5">
          Turn on notifications so you never miss a new message.
        </p>
      )}

      <div className="flex gap-2.5">
        {permissionState === "denied" && (
          <button
            onClick={handleEnableClick}
            disabled={saving}
            className="bg-amber-400 text-black rounded-lg px-4 py-2 text-[13px] font-semibold
                       hover:bg-amber-300 transition-colors disabled:opacity-70 disabled:cursor-default"
          >
            {saving ? "Enabling..." : "Enable Notifications"}
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="bg-transparent text-gray-400 border border-zinc-700 rounded-lg px-4 py-2
                     text-[13px] hover:border-zinc-500 hover:text-gray-300 transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
// lib/firebase-client.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBHwUOXU9BJrk3H00Q3RBDsUGw20RpXEGc",
  authDomain: "pushnotification-adminchats.firebaseapp.com",
  projectId: "pushnotification-adminchats",
  storageBucket: "pushnotification-adminchats.firebasestorage.app",
  messagingSenderId: "819443902431",
  appId: "1:819443902431:web:7c06d2401deb1fa1ae866a",
  measurementId: "G-C15XPN1N2M"
};

// Avoid re-initializing on hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Call this function from a client component (e.g. after login) to
// ask permission and get the device token.
export const requestNotificationPermission = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.log("This browser does not support Firebase Messaging.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted.");
      return null;
    }

    const messaging = getMessaging(app);

    // Register the service worker manually so we control the path
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM device token:", token);
      return token;
    } else {
      console.log("No registration token available.");
      return null;
    }
  } catch (err) {
    console.error("Error getting notification permission/token:", err);
    return null;
  }
};

// Call this to listen for messages while the app is in the FOREGROUND
// (background messages are handled by the service worker file instead).
export const onForegroundMessage = (callback) => {
  isSupported().then((supported) => {
    if (!supported) return;
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      callback(payload);
    });
  });
};

export default app;
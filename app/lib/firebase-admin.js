// lib/firebase-admin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const serviceAccountJson = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
  "base64"
).toString("utf-8");
const serviceAccount = JSON.parse(serviceAccountJson);

const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(serviceAccount),
    });

export const messaging = getMessaging(adminApp);
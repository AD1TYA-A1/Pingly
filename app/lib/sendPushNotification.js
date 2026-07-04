// lib/sendPushNotification.js
import { messaging } from "./firebase-admin";
import clientPromise from "./mongodb";

// Call this whenever a new message is saved, passing the RECIPIENT's userId
export async function sendPushNotification(recipientUserId, { title, body, data = {} }) {
  try {
    const client = await clientPromise;
    const db = client.db("adminChat");

    const subscriptions = await db
      .collection("pushSubscriptions")
      .find({ userId: recipientUserId })
      .toArray();

    if (!subscriptions.length) {
      console.log("No push tokens found for user:", recipientUserId);
      return;
    }

    const tokens = subscriptions.map((sub) => sub.token);

    const message = {
      notification: { title, body },
      data, // e.g. { chatId: "123", url: "/chat/123" } for click-through
      tokens, // sends to multiple devices at once
    };

    const response = await messaging.sendEachForMulticast(message);

    // Clean up invalid/expired tokens automatically
    response.responses.forEach((res, idx) => {
      if (!res.success && res.error?.code === "messaging/registration-token-not-registered") {
        db.collection("pushSubscriptions").deleteOne({ token: tokens[idx] });
      }
    });

    console.log(`Push sent: ${response.successCount} success, ${response.failureCount} failed`);
  } catch (err) {
    console.error("Error sending push notification:", err);
  }
}
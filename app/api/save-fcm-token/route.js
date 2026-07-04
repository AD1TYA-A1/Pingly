// app/api/save-fcm-token/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Get user from your existing JWT cookie/auth pattern
    const authToken = req.cookies.get("token")?.value; // adjust cookie name to yours
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId; // adjust to match your JWT payload shape

    const client = await clientPromise;
    const db = client.db("adminChat"); // uses default db from your connection string

    // Store token against user, avoid duplicates (a user may have multiple devices)
    await db.collection("pushSubscriptions").updateOne(
      { userId, token },
      { $set: { userId, token, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving FCM token:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
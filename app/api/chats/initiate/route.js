import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";
import { sendPushNotification } from "@/app/lib/sendPushNotification";

export async function POST(req) {
    try {

        // To Start an actual converation by sending the message 
        const cookieStore = await cookies()
        const client = await clientPromise
        const db = client.db("adminChat")
        const body = await req.json()
        const token = cookieStore.get('token')?.value;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const myID = new ObjectId(decoded.userId)
        const otherID = new ObjectId(body.otherID)

        // In body I want objectID of user I want to chat with 
        console.log(otherID);

        console.log(decoded.userId);

        // Sort so order never matters
        const participants = [decoded.userId, body.otherID].sort()

        let conversation = await db.collection("conversations").findOne({
            participants
        });

        if (!conversation) {
            const result = await db.collection("conversations").insertOne({
                participants,
                lastMessage: body.lastMessage,
                createdAt: new Date()
            }, { returnDocument: "after" });


            conversation = {
                _id: result.insertedId,
                participants
            };

        }

        const conversationId = conversation._id;

        await db.collection("chats").insertOne({
            conversationId,
            sender: myID,
            receiver: otherID,
            message: body.message,
            date: new Date()
        });

        // Look up sender's name/username to show in the notification
        const senderUser = await db.collection("users").findOne({ _id: myID });
        const senderName = senderUser?.userName || senderUser?.name || "New message";

        // Fire push notification to the receiver (don't block the response on this)
        sendPushNotification(body.otherID, {
            title: senderName,
            body: body.message,
            data: { conversationId: conversationId.toString() },
        }).catch((err) => console.error("Push notification error:", err));

        return NextResponse.json({ success: true, conversationId }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}
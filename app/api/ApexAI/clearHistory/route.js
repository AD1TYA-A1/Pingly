import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";

export async function DELETE() {
    try {

        // To Start an actual converation by sending the message 
        const cookieStore = await cookies()
        const client = await clientPromise
        const db = client.db("adminChat")
        // const body = await req.json()
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "No Token!!" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = new ObjectId(decoded.userId)


        const conversation = await db.collection("conversationsWithAPEX").findOne({ user: userId })

        if (!conversation) {
            return NextResponse.json({ success: false, message: "No conversation found" }, { status: 404 })
        }

        const conversationId = conversation._id

        await db.collection("conversationsWithAPEX").deleteOne({ _id: conversationId })
        await db.collection("chatsWithApex").deleteMany({ conversationId })

        return NextResponse.json({ success: true, message: "Conversation deleted" }, { status: 200 })


    } catch (error) {
        console.log(error.message);

        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}
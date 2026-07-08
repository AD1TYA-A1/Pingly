import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";

export async function POST(req) {
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
        const userId = decoded.userId
        // const lastId = body.lastId


        const conversation = await db.collection("conversationsWithAPEX").findOne({
            user: new ObjectId(userId)
        });

        // console.log(conversation);

        if (!conversation) {
            return NextResponse.json({ "success": false, message: "User Not Found" }, { status: 201 })
        }

        console.log(conversation);

        const conversationId = conversation._id
        // console.log(conversationId);
        


        // const chats = await db.collection("chatsWithApex").find({
        //     conversationId: new ObjectId(conversationId),
        //     ...(lastId && { _id: { $lt: new ObjectId(lastId) } })   // Spread operator helped me to use if else in just one Line
        // }).sort({ _id: -1 }) // Newest IDs first (Descending)
        //     .limit(5).toArray()


        const chats = await db.collection("chatsWithApex").find({
            conversationId: new ObjectId(conversationId)
        }).sort({_id:-1}).toArray()


        console.log(chats);


        if (chats.length <= 0) {
            // console.log("NULL HE");
            return NextResponse.json({ success: false, message: "No Chats" }, { status: 200 })
        }
        const last_id = chats[chats.length - 1]._id ?? null

        return NextResponse.json({ success: true, chats, last_id }, { status: 200 })


    } catch (error) {
        console.log(error.message);

        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}
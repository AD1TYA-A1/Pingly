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
        const body = await req.json()
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "No Token!!" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // const myID = new ObjectId(decoded.userId)
        // let conversationId = new ObjectId(body.conversationId) || ""
        // In body I want objectID of user I want to chat with 
        // console.log(conversationId);





        // console.log(decoded.userId);

        // Sort so order never matters
        // const participants = [].sort()

        let conversation = await db.collection("conversationsWithAPEX").findOne({
            user: new ObjectId(decoded.userId)
        });


        // console.log(conversation);


        if (!conversation) {
            const result = await db.collection("conversationsWithAPEX").insertOne({
                user: new ObjectId(decoded.userId),
                lastMessage: body.lastMessage,
                createdAt: new Date(),
            }, { returnDocument: "after" });


            conversation = {
                _id: result.insertedId,
                user: decoded.userId,
            };

        }

        const conversationId = conversation._id;



        await db.collection("chatsWithApex").insertOne({
            conversationId,
            role: body.role,
            content: body.message,
            time: new Date()
        });

        return NextResponse.json({ success: true, conversationId }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

}
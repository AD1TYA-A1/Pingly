import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import jwt, { decode } from 'jsonwebtoken';

export async function POST(req) {
    try {

        const body = await req.json();
        const client = await clientPromise
        const db = await client.db("adminChat")

        const token = cookieStore.get('token')?.value;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)


        // FINDING ALL F USERS CHAT IF PRESENT
        const conversations = await db.collection("conversations").find({
            participants: decoded.email
        }).toArray()
        //.find() does NOT directly return the actual data.
        // It returns a:
        //     Cursor
        // Think of cursor like:
        //     "A pointer/iterator to database results"
        //     Without.toArray()
        // This prints something like:

        // FindCursor { }

        // NOT the actual documents.

        // Because MongoDB is saying:

        //     "Okay I found matching documents, here is a cursor to iterate them."

        if (conversations.length === 0) {

            return NextResponse.json({
                success: true,
                message: "No conversations found",
                conversations: []
            })
        }
        else {
            return NextResponse.json({
                success: true,
                conversations
            })
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, {
            status: 500
        })
    }


}


// Example DOCUMENT
// {
//   _id: ObjectId("abc123"),

//   participants: [
//     "luffy@gmail.com",
//     "zoro@gmail.com"
//   ],

//   lastMessage: "Hey bro",

//   createdAt: new Date(),
//   updatedAt: new Date()
// }
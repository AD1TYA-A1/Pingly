import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req) {
    const body = await req.json();
    
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
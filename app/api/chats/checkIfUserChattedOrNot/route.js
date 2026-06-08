// This route checks if My user have chatted with the person in foward in time or not Helpgul for sluf [id]

import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import jwt, { decode } from 'jsonwebtoken';

export async function POST(req) {
    // To Start an actual converation by sending the message 
    const cookieStore = await cookies()
    const client = await clientPromise
    const db = client.db("adminChat")
    const body = await req.json()
    const token = cookieStore.get('token')?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const participants = [decoded.userId, body.otherId].sort();

    const conversation = await db.collection("conversations").findOne(
        { participants: { $all: participants } })


    return NextResponse.json({ sucess: true, conversation }, { status: 200 })

}
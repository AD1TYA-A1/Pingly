import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req) {
    const client = await clientPromise
    const db = await client.db("adminChat")
    const body = await req.json()
    const form = body.form

    const update = await db.collection("users").updateOne(
        { userName: form.userName || "luffy" }, // ideally send this from frontend
        {
            $set: {
                displayName: form.displayName,
                bio: form.bio,
                avatarUrl: form.avatarUrl,
                avatarColor: form.avatarColor,
                status: form.status,
                tagline: form.tagline,
                emoji: form.emoji,
                updatedAt: new Date()
            }
        }
    )

    console.log(update);
    
    return NextResponse.json({ success: true, message: "All Set" }, { status: 200 })

}
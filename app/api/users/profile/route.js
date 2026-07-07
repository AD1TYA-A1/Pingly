import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import jwt, { decode } from 'jsonwebtoken';

export async function POST(req) {
    const cookieStore = await cookies();
    const body = await req.json();
    console.log(body);
    const form = body;
    
    // console.log("YOUR FORM");

    // console.log(form);
    // console.log("YOUR FORM");

    const token = cookieStore.get('token')?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const client = await clientPromise
    const db = await client.db("adminChat")


    const update = await db.collection("users").updateOne(
        { email: decoded.email }, // ideally send this from frontend
        {
            $set: {
                userName:body.userName,
                bio: form.bio,
                avatarUrl: form.avatarUrl,
                avatarColor: form.avatarColor,
                status: form.status,
                tagline: form.tagline,
                displayName:form.displayName,
                emoji: form.emoji,
                updatedAt: new Date()
            }
        }
    )

    console.log(update);

    return NextResponse.json({ success: true, message: "All Set" }, { status: 200 })

}
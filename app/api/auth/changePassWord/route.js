import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {


        const client = await clientPromise
        const db = await client.db("adminChat")
        const body = await req.json()

        const email = body.email
        const findAccount = await db.collection("users").findOneAndUpdate(
            { email: email },
            { $set: { password: body.newPassword } },
            { returnDocument: 'after' } // Crucial: Returns the updated user document
        )
        console.log(findAccount);




        if (findAccount) {
            return NextResponse.json({ success: true, message: "PassWord Changed" }, { status: 201 })
        }
        return NextResponse.json({ success: false, message: "Invalid Email" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 409 })

    }
}
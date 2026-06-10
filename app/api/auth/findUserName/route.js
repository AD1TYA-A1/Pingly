import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    const client = await clientPromise
    const db = await client.db("adminChat")
    const body = await req.json()

    const userName = body.userName
    const findAccount = await db.collection("users").findOne({
        userName: userName
    })
    // console.log(findAccount);


    if (findAccount) {
        return NextResponse.json({ success: true, message: "OTP sent to the registered Email", email:findAccount.email }, { status: 201 })
    }
    return NextResponse.json({ success: false, message: "Invalid UserName" }, { status: 200 })

}
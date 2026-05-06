import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req) {
    const client = await clientPromise
    const db = await client.db("adminChat")
    const body = await req.json()

    const credentials = await db.collection("users").findOne({ userName: body.userName, password: body.password })

    // console.log(credentials);

    if (credentials) {
        return NextResponse.json({ success: true, message: "Log In Success" })
    }
    return NextResponse.json({ success: false, message: "Invalid Credentials" })
    
}

// _id
// 69d9ae99809ad9c6825c1c33
// email
// "a.d.i.t.y.a.654a@gmail.com"
// userName
// "luffy"
// password
// "Admin@123***"
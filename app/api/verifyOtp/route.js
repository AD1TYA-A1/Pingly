import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    const client = await clientPromise;
    const db = client.db("adminChat")
    const body = await req.json()
    console.log(body);
    
    const otp = body.otp
    console.log(otp);
    

    const otpRecord = await db.collection("otp").findOne({ email: body.email, otp: otp });
    // console.log(user);

    // console.log(otpRecord);
    

    if (!otpRecord) {
        return NextResponse.json({ verification: "failed" });
    }
    
    await db.collection("otp").deleteOne({ email: body.email, otp: otp });

    
    return NextResponse.json({ verification: "success" });
}


import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import jwt, { decode } from 'jsonwebtoken';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await clientPromise;
    const db = await client.db("adminChat")
    // console.log(decoded);
    // console.log(decoded.email);
    // console.log(decoded.userId);

    const user = await db.collection("users").findOne({ email: decoded.email },
        { projection: { password: 0 } })  // ← this excludes password in native MongoDB
    // console.log("user is ", user)
    return NextResponse.json(user)
}
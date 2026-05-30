import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import jwt, { decode } from 'jsonwebtoken';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const client = await clientPromise
        const db = await client.db("adminChat")

        const users = await db.collection("users").find({
            email:{$ne:decoded.email}
        }).toArray() // except that document where email is decpded.email   
        return NextResponse.json({ sucess: true, users }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ sucess: false, error }, { status: 500 })

    }

}
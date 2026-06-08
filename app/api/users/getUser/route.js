import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
    try {

        const client = await clientPromise;
        const db = client.db("adminChat")

        const body = await req.json()

        const user = await db.collection("users").find({
            _id: new ObjectId(body.id)
        }, { projection: { password: 0 } }).toArray()
        // console.log(user);


        if (user.length !== 0) {
            return NextResponse.json({ success: true, user }, { status: 200 })
        }
        return NextResponse.json({ success: false }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}
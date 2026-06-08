import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
    try {

        const client = await clientPromise;
        const db = client.db("adminChat")

        const body = await req.json()

        const user = await db.collection("users").findOne({
            _id: new ObjectId(body.id)
        }, { projection: { password: 0 } }
        )
        // console.log(user);


        if (user) {
            return NextResponse.json({ success: true, user }, { status: 200 })
        }
        return NextResponse.json({ success: false }, { status: 404 })

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}
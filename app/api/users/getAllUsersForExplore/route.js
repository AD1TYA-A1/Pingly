import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import jwt, { decode } from 'jsonwebtoken';
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ sucess: false, error }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const client = await clientPromise
        const db = await client.db("adminChat")


        const converation = await db.collection("conversations").find({
            participants: decoded.userId
        }).toArray()

        // console.log(converation);
        let myChattersID = converation.map(user => new ObjectId(user.participants[1]))
        // console.log(myChatters);
        // console.log(myChattersID);


        // console.log([new Object(decoded.userId), ...myChattersID]);


        const users = await db.collection("users").find({
            _id: ({ $nin: [new ObjectId(decoded.userId), ...myChattersID] })
        }, { projection: { password: 0 } }).toArray() // except that document where email is decpded.email


        return NextResponse.json({ sucess: true, users }, { status: 200 })
    } catch (error) {
        // console.log(error.message);
        return NextResponse.json({ sucess: false, error }, { status: 500 })

    }

}
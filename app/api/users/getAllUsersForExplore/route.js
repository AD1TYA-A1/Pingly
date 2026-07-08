import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import jwt, { decode } from 'jsonwebtoken';
import { ObjectId } from "mongodb";

export async function POST(req) {
    try {
        const body = await req.json()
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json({ sucess: false, error: "No token" }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const client = await clientPromise
        const db = await client.db("adminChat")


        // const allUsers = await db.collection("conversations").find().toArray()
        // console.log("All Users in DB: \n", allUsers);

        // console.log("PARTICIPANTS");
        let lastId = body.lastId;
        const myChattersID = []


        const converation = await db.collection("conversations").find({
            participants: decoded.userId
        }).toArray()
        // console.log(decoded.userId);


        converation.map(user => {
            // console.log("Participant: \n", user.participants);
            user.participants.forEach(element => {
                if (element != decoded.userId) {
                    myChattersID.push(new ObjectId(element))
                    // console.log("Element: \n", element);
                }
            });
            // allUsers.map(a => {
            //     if (user.participants != a.participants) {
            //         myChattersID.push(a.participants)
            //     }
            // })

        })

        // console.log(myChattersID);

        // console.log("My conversations: \n", converation);

        // console.log(converation);
        // let myChattersID = converation.map(user => new ObjectId(user.participants[1]))
        // console.log(myChatters);
        // console.log(myChattersID);


        // console.log([new Object(decoded.userId), ...myChattersID]);


        const users = await db.collection("users").find({
            _id: ({ $nin: [new ObjectId(decoded.userId), ...myChattersID] }),
            ...(lastId && { _id: { $gt: new ObjectId(lastId), $nin: [new ObjectId(decoded.userId), ...myChattersID] } })
        }, { projection: { password: 0 } }).sort({ _id: 1 }).limit(5).toArray() // except that document where email is decpded.email

        users.forEach(element => {
            lastId = element._id;
        })
        // console.log("lastId", lastId);


        return NextResponse.json({ sucess: true, users, lastId }, { status: 200 })
    } catch (error) {
        // console.log(error.message);
        return NextResponse.json({ sucess: false, error: error.message }, { status: 500 })

    }

}
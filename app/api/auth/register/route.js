import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import Email from "next-auth/providers/email";
import { Return } from "three/src/nodes/TSL.js";


//  Status --> 200 OK
//  Status --> 201 CREATED

export async function POST(req) {
    const client = await clientPromise;
    const db = await client.db("adminChat")
    const body = await req.json()
    const email = body.email;
    const userName = body.userName;

    
    // console.log(body.userName);



    try {
        //Checking if email is Alreaady in use or not
        const doEmailExists = await db.collection("users").findOne({ email: email })
        console.log(doEmailExists);

        if (doEmailExists) {
            return NextResponse.json({ success: false, message: "Email Already Exists" }, { status: 409 })
            // 409 → Conflict (e.g. username already exists ✅ better than 400 in your case)
        }

        // Checking If userName is available or not 
        const doUserNameExists = await db.collection("users").findOne({ userName: userName });
        console.log(doUserNameExists);
        if (doUserNameExists) {
            return NextResponse.json({ success: false, message: "UserName Already Exists" }, { status: 409 })
            // 409 → Conflict (e.g. username already exists ✅ better than 400 in your case)        }
        }

        // Adding the User
        const addUser = await db.collection("users").insertOne({
            email:body.email,
            userName:body.userName,
            password: body.password
        })

        if (addUser) {
            return NextResponse.json({ success: true, message: "User Registered Successfully" }, { status: 201 })
            // The HTTP status code 201 created is a  SUCCESS REQUEST indicating that a request was fulfilled and resulted in the creation of one or more new resources
        }
        return NextResponse.json({ success: false, message: "Cannot Register User" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

}
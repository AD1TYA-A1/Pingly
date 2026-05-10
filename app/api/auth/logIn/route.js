import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


export async function POST(req) {
    const client = await clientPromise
    const db = await client.db("adminChat")
    const body = await req.json()

    const credentials = await db.collection("users").findOne({ userName: body.userName, password: body.password })

    console.log(credentials);

    if (credentials) {
        // ✅ Create JWT token
        const token = jwt.sign(
            { userId: credentials._id, email: credentials.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // stays valid for 7 days
        );

        // ✅ Save token in cookie
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,    // JS can't access it (more secure)
            secure: false,     // set true in production
            maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
            path: '/',
        });

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
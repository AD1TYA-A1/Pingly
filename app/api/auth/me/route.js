import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import jwt, { decode } from 'jsonwebtoken';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            cookies().delete("token");
            if (jwtError.name === "TokenExpiredError") {
                return NextResponse.json({ message: "Token expired" }, { status: 401 });
            }
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        } if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        // console.log("JWT_SECRET:", process.env.JWT_SECRET);
        // console.log("token:", token);
        const client = await clientPromise;
        const db = await client.db("adminChat")
        // console.log(decoded);
        // console.log(decoded.email);
        // console.log(decoded.userId);

        const user = await db.collection("users").findOne({ email: decoded.email },
            { projection: { password: 0 } })  // ← this excludes password in native MongoDB
        // console.log("user is ", user)
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user)
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

}
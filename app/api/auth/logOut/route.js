import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST() {
    const response = NextResponse.json({
        success: true,
        message: "Logged out successfully"
    });

    response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0), // Expire immediately
        path: "/"
    });

    return response;
}
import nodemailer from "nodemailer";
import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, userN } = await req.json();
  const client = await clientPromise;
  const db = client.db("adminChat");


  // 1. Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {

    //Checking if email is Alreaady in use or not
    const doUserNameExists = await db.collection("users").findOne({ email: email })
    // console.log(doUserNameExists);
    if (doUserNameExists) {
      return NextResponse.json({ success: false, message: "Email exists 🏠 — try logging in 😉" }, { status: 409 })
      // 409 → Conflict (e.g. username already exists ✅ better than 400 in your case)
    }

    //Checking if email is Alreaady in use or not
    const doEmailExists = await db.collection("users").findOne({ email: email })
    // console.log(doEmailExists);
    if (doEmailExists) {
      return NextResponse.json({ success: false, message: "Someone beat you to this username 😅" }, { status: 409 })
      // 409 → Conflict (e.g. username already exists ✅ better than 400 in your case)
    }


    const user = await db.collection("otp").insertOne({
      email: email,
      otp: otp,
      createdAt: new Date()
    })


  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }




  // 2. Create transporter (this replaces smtp.example.com from their docs)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // 3. Send email
  await transporter.sendMail({
    from: `"Admin-Chats" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family:sans-serif;padding:30px;background:#000;color:#fff;border-radius:12px">
        <h2 style="color:#f59e0b">Admin-Chats</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:10px;color:#f59e0b">${otp}</h1>
        <p style="color:#888">Expires in 5 minutes. Do not share this with anyone.</p>
      </div>
    `,
  });

  // 4. Save OTP to DB here (MongoDB)
  // await OtpModel.create({ email, otp, createdAt: new Date() })

  return NextResponse.json({ success: true, message: "Boom! OTP just landed in your inbox 🚀" }, { status: 201 })
  // The HTTP status code 201 created is a  SUCCESS REQUEST indicating that a request was fulfilled and resulted in the creation of one or more new resources
}
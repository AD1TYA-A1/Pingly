import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {

    try {
        // const cookieStore = await cookies()
        const client = await clientPromise
        const db = client.db("adminChat")
        const body = await req.json()
        // const token = cookieStore.get('token')?.value;
        // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const lastId = body.lastId;
        // const myID = decoded.userId
        // const otherID = body.otherID

        const conversationID = body.conversationID // 6a1d285b588b8949a0b542e6

        const chats = await db.collection("chats").find({
            conversationId: new ObjectId(conversationID),
            ...(lastId && { _id: { $lt: new ObjectId(lastId) } })   // Spread operator helped me to use if else in just one Line

        }).sort({ _id: -1 }) // Newest IDs first (Descending)
            .limit(20).toArray()

        // OR=======OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR========OR    // ✅ Also works but more verbose
        // const query = { conversationId: new ObjectId(conversationID) }
        // if (lastId) {
        //     query._id = { $lt: new ObjectId(lastId) }
        // }
        // db.collection("chats").find(query)







        // console.log(chats);

        //         The spread trick is just a one - liner shortcut for the if block above it.Both do the exact same thing.The spread just lets you conditionally add a key inside an object literal which JS doesn't allow any other way.
        // That's literally the only reason. It's just cleaner code.

        if (chats.length == 0) {
            return NextResponse.json({ success: false }, { status: 200 })
        }
        return NextResponse.json({ success: true, chats }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

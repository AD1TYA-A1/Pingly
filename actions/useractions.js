"use server";
import clientPromise from "../lib/mongodb";
export const fethUser = async (handle) => {
  const client = await clientPromise;
  const db = client.db("LinkTREE");
  const collection = db.collection("Links");
  let user = await collection.findOne({ handle: handle });
  if (!user) {
    return null;
  }

  // Convert MongoDB ObjectId to string for serialization
  return JSON.parse(JSON.stringify(user));
};

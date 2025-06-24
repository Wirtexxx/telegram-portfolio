import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("info");
        const data = await collection.find({}).toArray();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("DB GET error:", error);
        return NextResponse.json(
            { success: false, error: "Database error" },
            { status: 500 }
        );
    }
}

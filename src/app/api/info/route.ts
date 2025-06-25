import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import type { InfoData } from "@/types";

export async function GET() {
    try {
        const db = await connectToDatabase();
        const collection = db.collection<InfoData>("info");
        const info = await collection.findOne({ _id: "main" });
        return NextResponse.json(info);
    } catch (error) {
        console.error("DB GET error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

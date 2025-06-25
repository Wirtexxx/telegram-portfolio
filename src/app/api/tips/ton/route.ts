import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { address, tx_hash, amount } = body;
        if (!address || !tx_hash || !amount) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        const db = await connectToDatabase();
        const collection = db.collection("transactions");

        const tip = {
            address,
            tx_hash,
            amount,
            createdAt: new Date(),
        };

        await collection.insertOne(tip);

        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// lib/mongodb.ts

import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || "customer";

let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

export async function connectToDatabase(): Promise<Db> {
    if (cachedClient) {
        return cachedClient.db(dbName);
    }

    if (!cachedPromise) {
        const client = new MongoClient(uri);
        cachedPromise = client.connect();
    }

    cachedClient = await cachedPromise;
    return cachedClient.db(dbName);
}

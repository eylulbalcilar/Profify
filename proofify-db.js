import { MongoClient } from 'mongodb';
import 'dotenv/config';

const url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/proofify";
const client = new MongoClient(url);

export async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
        return client.db("proofify").collection("documents");
    } catch (e) {
        console.error("Database connection failed:", e.message);
        process.exit(1);
    }
}
import express from "express";
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();
app.use(express.json());

const url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/proofify";
const client = new MongoClient(url);

let documentsCollection;

async function connectToDb() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db("proofify");
        documentsCollection = db.collection("documents");
        
        const count = await documentsCollection.countDocuments();
        if (count === 0) {
            await documentsCollection.insertMany([
                { docId: "doc1", ownerOrg: "org1", content: "Initial sample" },
                { docId: "doc2", ownerOrg: "org2", content: "Second sample" }
            ]);
        }
    } catch (err) {
        console.error("Database error:", err);
    }
}

connectToDb();

app.get("/documents", async (req, res) => {
    const orgID = req.headers["x-org-id"];
    if (!orgID) return res.status(400).send("Missing organization header");
    
    try {
        const docs = await documentsCollection.find({ ownerOrg: orgID }).toArray();
        res.status(200).send(docs);
    } catch (err) {
        res.status(500).send("Fetch error");
    }
});

app.post("/upload", async (req, res) => {
    try {
        const { docId, ownerOrg, content } = req.body;
        if (!docId || !ownerOrg) return res.status(400).send("Invalid data");
        
        await documentsCollection.insertOne({ docId, ownerOrg, content });
        res.status(201).send("Document uploaded");
    } catch (err) {
        res.status(500).send("Upload error");
    }
});

app.post("/proof/:id", async (req, res) => {
    const orgID = req.headers["x-org-id"];
    try {
        const doc = await documentsCollection.findOne({ docId: req.params.id });
        if (!doc) return res.status(404).send("Not found");
        if (doc.ownerOrg !== orgID) return res.status(403).send("Forbidden");
        
        res.status(202).send("Proof accepted");
    } catch (err) {
        res.status(500).send("Server error");
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
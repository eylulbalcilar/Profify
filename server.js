import express from "express";
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();
app.use(express.json());

const url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/proofify";
const client = new MongoClient(url);
let dbCollection;

async function startServer() {
    try {
        await client.connect();
        dbCollection = client.db("proofify").collection("documents");
        app.listen(process.env.PORT || 5001);
    } catch (e) {
        process.exit(1);
    }
}

const auth = (req, res, next) => {
    const id = req.headers["x-org-id"];
    if (!id) return res.status(400).json({ error: "Missing ID" });
    req.orgID = id;
    next();
};

app.get("/documents", auth, async (req, res) => {
    try {
        const data = await dbCollection.find({ ownerOrg: req.orgID }).toArray();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/documents", async (req, res) => {
    try {
        const { docId, ownerOrg, content } = req.body;
        if (!docId || !ownerOrg || !content) return res.status(400).json({ error: "Invalid data" });
        await dbCollection.insertOne({ docId, ownerOrg, content });
        res.status(201).json({ status: "Created" });
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/documents/proof/:id", auth, async (req, res) => {
    try {
        const item = await dbCollection.findOne({ docId: req.params.id });
        if (!item) return res.status(404).json({ error: "Not found" });
        if (item.ownerOrg !== req.orgID) return res.status(403).json({ error: "Forbidden" });
        res.status(202).json({ status: "Accepted" });
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

app.delete("/documents/:id", auth, async (req, res) => {
    try {
        const result = await dbCollection.deleteOne({ docId: req.params.id, ownerOrg: req.orgID });
        if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

startServer();
import express from "express";
import { MongoClient, ObjectId } from 'mongodb';
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
        const port = process.env.PORT || 5001;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (e) {
        process.exit(1);
    }
}

const auth = (req, res, next) => {
    const id = req.headers["x-org-id"];
    if (!id) return res.status(400).json({ error: "Organization ID required" });
    req.orgID = id;
    next();
};

app.get("/documents", auth, async (req, res) => {
    try {
        const data = await dbCollection.find({ ownerOrg: req.orgID }).toArray();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/documents", auth, async (req, res) => {
    try {
        const { docId, content, studentName } = req.body;
        if (!docId || !content || !studentName) {
            return res.status(400).json({ error: "Incomplete document data" });
        }
        const newDocument = { docId, ownerOrg: req.orgID, content, studentName };
        await dbCollection.insertOne(newDocument);
        res.status(201).json({ status: "Created" });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/documents/proof/:id", auth, async (req, res) => {
    try {
        const item = await dbCollection.findOne({ docId: req.params.id });
        if (!item) return res.status(404).json({ error: "Document not found" });
        if (item.ownerOrg !== req.orgID) return res.status(403).json({ error: "Forbidden" });
        res.status(202).json({ status: "Accepted" });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete("/documents/:id", auth, async (req, res) => {
    try {
        const result = await dbCollection.deleteOne({ 
            docId: req.params.id, 
            ownerOrg: req.orgID 
        });
        if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
});

startServer();
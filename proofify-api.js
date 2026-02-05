import express from "express";
import { connectToDatabase } from "./proofify-db.js";

const app = express();
app.use(express.json());

let dbCollection;

const auth = (req, res, next) => {
    const id = req.headers["x-org-id"];
    if (!id) {
        return res.status(400).json({ 
            error: "Bad Request",
            message: "Missing 'x-org-id' header." 
        });
    }
    req.orgID = id;
    next();
};

app.get("/documents", auth, async (req, res) => {
    try {
        const data = await dbCollection.find({ ownerOrg: req.orgID }).toArray();
        res.status(200).json({
            count: data.length,
            message: `Retrieved ${data.length} records for ${req.orgID}.`,
            data
        });
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/documents", auth, async (req, res) => {
    try {
        const { docId, content, studentName } = req.body;
        if (!docId || !content || !studentName) {
            return res.status(400).json({ 
                error: "Bad Request",
                message: "Required fields missing: docId, content, or studentName."
            });
        }
        const newDocument = { docId, ownerOrg: req.orgID, content, studentName };
        await dbCollection.insertOne(newDocument);
        res.status(201).json({ 
            status: "Created",
            message: "Document registered successfully."
        });
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/documents/proof/:id", auth, async (req, res) => {
    try {
        const item = await dbCollection.findOne({ docId: req.params.id });
        if (!item) {
            return res.status(404).json({ 
                error: "Not Found",
                message: "Document ID not found." 
            });
        }
        if (item.ownerOrg !== req.orgID) {
            return res.status(403).json({ 
                error: "Forbidden",
                message: "Access denied: Unauthorized organization." 
            });
        }
        res.status(202).json({ 
            status: "Accepted",
            message: "Verification successful."
        });
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete("/documents/:id", auth, async (req, res) => {
    try {
        const result = await dbCollection.deleteOne({ 
            docId: req.params.id, 
            ownerOrg: req.orgID 
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                error: "Not Found",
                message: "No matching document found." 
            });
        }
        res.status(204).send(); 
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

async function run() {
    dbCollection = await connectToDatabase();
    const port = process.env.PORT || 5001;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}

run();
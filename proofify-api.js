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
            message: "Authentication failed: Missing organization identifier." 
        });
    }
    req.orgID = id;
    next();
};

app.get("/documents", auth, async (req, res) => {
    try {
        const data = await dbCollection.find({ ownerOrg: req.orgID }).toArray();
        res.status(200).json({
            message: `Magic! We found ${data.length} legendary records for ${req.orgID}.`,
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
                message: "Opps! Please provide all required fields to register a document."
            });
        }
        const newDocument = { docId, ownerOrg: req.orgID, content, studentName };
        await dbCollection.insertOne(newDocument);
        res.status(201).json({ 
            status: "Created",
            message: `Excellent! ${studentName}'s document has been successfully registered.`
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
                message: "The requested document ID does not exist in our database." 
            });
        }
        if (item.ownerOrg !== req.orgID) {
            return res.status(403).json({ 
                error: "Forbidden",
                message: "Stop right there! This belongs to another institution." 
            });
        }
        res.status(202).json({ 
            status: "Accepted",
            message: `Brilliant! ${item.studentName}'s record is 100% genuine!`
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
                message: "No matching document found to delete. Security check passed!" 
            });
        }

        res.status(200).json({ 
            message: "Gone forever! Just like your last coffee." 
        });
        
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

async function run() {
    dbCollection = await connectToDatabase();
    const port = process.env.PORT || 5001;
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}

run();
// const { ObjectId } = require('mongodb');
const express = require('express');
const { usersCollection } = require('../mongodb/mongodb-conn');
const router = express.Router();

// Register and Login APIs
router.post("/register", async (req, res) => {
    const incomingUser = req.body;
    try {
        // Record user in db
        const result = await usersCollection.insertOne(incomingUser);
        res.json({ userId: result.insertedId });
    }
    catch {
        res.json({ userId: "" });
    }
});

router.post("/login", async (req, res) => {
    const incomingUser = req.body;
    try {
        // Check if a user exists
        const result = await usersCollection.findOne({ email: incomingUser.email });
        if (result) {
            // User exists in db
            res.json({ userId: result._id, userRole: result.role });
        } else {
            res.json({ userId: "", userRole: "" });
        }
        res.json({ userId: "", userRole: "" });
    }
    catch {
        res.json({ userId: "", userRole: "" });
    }
});

module.exports = router;
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
        const findResult = await usersCollection.findOne({ email: incomingUser.email });
        if (findResult) {
            // User exists in db
            res.json({ userId: findResult._id, userRole: findResult.role });
        } else {
            // User doesn't exist in db
            const newUser = {
                name: incomingUser.name,
                email: incomingUser.email,
                role: "user"
            };
            const insertResult = await usersCollection.insertOne(newUser);
            res.json({ userId: insertResult.insertedId, userRole: "user" });
        }
    }
    catch {
        res.json({ userId: "", userRole: "" });
    }
});

module.exports = router;
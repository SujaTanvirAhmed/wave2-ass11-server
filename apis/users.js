const { ObjectId } = require('mongodb');
const express = require('express');
const { usersCollection } = require('../mongodb/mongodb-conn');
const router = express.Router();

router.get("/:user_id", async (req, res) => {
    const userId = req.params.user_id;
    try {
        const user = await usersCollection.findOne({ _id: ObjectId(userId) });

        if (user) {
            res.json(user);
        }
    }
    catch {
        res.json({});
    }
});

module.exports = router;
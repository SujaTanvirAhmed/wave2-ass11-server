const express = require('express');
const { aboutCollection } = require('../mongodb/mongodb-conn');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const cursor = await aboutCollection.find({});

        if ((await cursor.count()) > 0) {
            const result = await cursor.toArray();
            res.json(result);
        }
    }
    catch {
        res.json([]);
    }
});

module.exports = router;
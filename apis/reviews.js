const express = require('express');
const { reviewsCollection } = require('../mongodb/mongodb-conn');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const cursor = await reviewsCollection.find({});
        if ((await cursor.count()) > 0) {
            res.json(await cursor.toArray());
        }
    }
    catch {
        res.status(200).send("Error");
    }
});

module.exports = router;
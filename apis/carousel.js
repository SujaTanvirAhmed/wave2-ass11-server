const express = require('express');
const { carouselCollection } = require('../mongodb/mongodb-conn');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const cursor = carouselCollection.find({});
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
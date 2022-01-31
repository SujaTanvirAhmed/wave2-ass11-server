const { ObjectId } = require('mongodb');
const express = require('express');
const {
    servicesCollection,
    ordersCollection
} = require('../mongodb/mongodb-conn');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const cursor = await servicesCollection.find({});

        if ((await cursor.count()) > 0) {
            const result = await cursor.toArray();
            res.json(result);
        }
    }
    catch {
        res.json([]);
    }
});

router.post("/", async (req, res) => {
    const service = req.body;
    try {
        const result = await servicesCollection.insertOne(service);
        if (result) {
            res.json({ reply: "SUCCESS" });
        }
    }
    catch {
        res.json({ reply: "FAILURE" });
    }
});

router.post("/remove", async (req, res) => {
    const { userId, serviceId } = req.body;
    try {
        const updateReq = await ordersCollection.updateOne(
            { user: userId },
            { $pull: { orders_array: serviceId } }
        )
        if ((await updateReq.modifiedCount) === 1) {
            res.json({ message: "SUCCESS" });
        }
    }
    catch {
        res.json({ message: "FAILURE" });
    }
});

router.get("/:serviceId", async (req, res) => {
    const serviceId = req.params.serviceId;
    try {
        const service = await servicesCollection.findOne({ _id: ObjectId(serviceId) });
        if (service) {
            res.status(200).json(service);
        }
    }
    catch {
        res.json({ message: "Error!" });
    }
});

module.exports = router;
const { ObjectId } = require('mongodb');
const express = require('express');
const { ordersCollection } = require('../mongodb/mongodb-conn');
const router = express.Router();

// Orders APIs

// "/all-orders"
router.get("/", async (req, res) => {
    try {
        const cursor = await ordersCollection.find({});

        if ((await cursor.count()) > 0) {
            const result = await cursor.toArray();
            res.json(result);
        }
    }
    catch {
        res.json([]);
    }
});

// "/approve-order/:orderId"
router.get("/approve/:orderId", async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const order = await ordersCollection.findOne({ _id: ObjectId(orderId) });
        if (order) {
            const newDoc = { $set: { approved: true } };
            const result = await orders.updateOne({ _id: ObjectId(orderId) }, newDoc);
            if (result.modifiedCount === 1) {
                res.json({ reply: "SUCCESS" });
            }
        }
    }
    catch {
        res.json({ reply: "FAILURE" });
    }
});

// "/cancel-order/:orderId"
router.get("/cancel/:orderId", async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const query = { _id: ObjectId(orderId) };
        const order = await ordersCollection.findOne(query);

        if (order) {
            const newDoc = { $set: { approved: false } };
            const result = await ordersCollection.updateOne(query, newDoc);
            res.json("SUCCESS");
        }
    }
    catch {
        res.json({ reply: "FAILURE" });
    }
});

// "/my-orders/:user_id"
router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const order = await ordersCollection.find({ user: userId });

        if (order) {
            res.json(await order.toArray());
        }
    }
    catch {
        res.json([]);
    }
});

// Book service API
router.post("/book-a-service", async (req, res) => {
    const { userId, serviceId, phone, address } = req.body;
    try {
        const insertReq = await ordersCollection.insertOne(
            {
                user: userId,
                phone,
                address,
                service: serviceId,
                approved: false
            }
        );
        if (insertReq.insertedId) {
            res.json({ message: "SUCCESS" });
        }
    }
    catch {
        res.json({ message: "FAILURE" });
    }
});

module.exports = router;
const express = require('express');
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

// Initialize the app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database settings
const mongodbConnectionUri =
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.CLUSTER_URL}?retryWrites=true&writeConcern=majority`;

const mongodbClient = new MongoClient(mongodbConnectionUri,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

// Connecting mongodb
async function startMongo() {
    try {
        await mongodbClient.connect();
        console.log("Mongodb connection successful!")
    }
    catch {
        console.log("Mongodb connection fails!");
    }
}
startMongo();

// Setup collections
const database = mongodbClient.db(process.env.DB_NAME);
const aboutCollection = database.collection("about");
const servicesCollection = database.collection("services");
const usersCollection = database.collection("users");
const ordersCollection = database.collection("orders");
const carouselCollection = database.collection("carousel");
const reviewsCollection = database.collection("reviews");

// Routes
app.get("/", (req, res) => {
    res.send("wave2-ass11-server is running...");
});

app.get("/about", async (req, res) => {
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

app.get("/services", async (req, res) => {
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

app.get("/services/:serviceId", async (req, res) => {
    const serviceId = req.params.serviceId;
    try {
        const service = await servicesCollection.findOne({ _id: ObjectId(serviceId) });
        if (service) {
            res.status(200).json(service);
        }
    }
    catch {
        res.status(200).json({});
    }
});

app.get("/approve-order/:orderId", async (req, res) => {
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

app.get("/cancel-order/:orderId", async (req, res) => {
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

app.get("/my-orders/:user_id", async (req, res) => {
    const userId = req.params.user_id;
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

app.get("/all-orders", async (req, res) => {
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

app.get("/users/:user-id", async (req, res) => {
    const userId = req.params.user - id;
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

app.post("/book-a-service", async (req, res) => {
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

app.get("/carousel", async (req, res) => {
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

app.post("/services", async (req, res) => {
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

app.post("/services/remove", async (req, res) => {
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

app.post("/register", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/reviews", async (req, res) => {
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

// Run the server
app.listen(port, () => {
    console.log(`wave2-ass11-server is running at http://localhost:${port}`);
});

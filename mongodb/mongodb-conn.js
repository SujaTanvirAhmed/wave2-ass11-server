const { MongoClient } = require('mongodb');

// Environment variables
const appDb = process.env.APP_DB;
const dbCluster = process.env.DB_CLUSTER;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const mongodbConnectionUri =
    `${appDb}://${dbUser}:${dbPass}@${dbCluster}?retryWrites=true&writeConcern=majority`;

const mongodbClient = new MongoClient(mongodbConnectionUri,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

mongodbClient.connect();
console.log("Mongodb connection successful!");

// Setup mongodb collections
const database = mongodbClient.db(dbName);
const aboutCollection = database.collection("about");
const servicesCollection = database.collection("services");
const usersCollection = database.collection("users");
const ordersCollection = database.collection("orders");
const carouselCollection = database.collection("carousel");
const reviewsCollection = database.collection("reviews");

module.exports = {
    aboutCollection,
    servicesCollection,
    usersCollection,
    ordersCollection,
    carouselCollection,
    reviewsCollection
};
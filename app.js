const express = require('express');
require('dotenv').config();
const cors = require('cors');

const port = process.env.PORT || 5000;

const reviewsApi = require('./apis/reviews');
const aboutApi = require('./apis/about');
const carouselApi = require('./apis/carousel');
const servicesApi = require('./apis/services');
const usersApi = require('./apis/users');
const ordersApi = require('./apis/orders');
const connectApi = require('./apis/connect');

// Initialize the app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Main function declaration
async function run() {
    try {
        // Home API
        app.get("/", async (req, res) => {
            res.send("wave2-ass11-server is running...");
        });

        // Connect APIs
        app.use('/connect', connectApi);

        // Carousel API
        app.use('/carousel', carouselApi);

        // Reviews API
        app.use('/reviews', reviewsApi);

        // About API
        app.use('/about', aboutApi);

        // Services APIs
        app.use('/services', servicesApi); //problem

        // Users API
        app.use('/users', usersApi);

        // Orders APIs
        app.use('/orders', ordersApi);

    }
    finally {
        // console.log("An un-avoidable message");
    }
}
// Run the main function
run().catch(console.dir);

// Run the server
app.listen(port, () => {
    console.log(`wave2-ass11-server is running at http://localhost:${port}`);
});

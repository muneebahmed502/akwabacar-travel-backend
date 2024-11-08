import express from 'express';
import google from './google.mjs'; // Import Google-specific routes
import stripe from './stripe.mjs';
import tripPublish from './tripPublish.mjs';
import tripBooking from './tripBooking.mjs';
import chat  from './chat.mjs';
// import bookingHistory from './bookingHistory.mjs'

const router = express.Router();

// Function to attach socket.io
const attachSocket = (io) => {
    console.log("Socket.io attached to routes.");
    io.on("connection", (socket) => {
        console.log("A user connected");
        // Existing socket logic goes here
    });
};

const setupRoutes = (io) => {
    attachSocket(io); // Attach socket.io
    console.log("Setting up routes...");
    router.use('/auth', google);
    router.use('/api', stripe);
    router.use('/tripPublish', tripPublish);
    router.use('/tripBooking', tripBooking);
    router.use('/chat',chat)
    // router.use('/bookingHistory',bookingHistory)
    return router; // Return the configured router
}

export default setupRoutes;

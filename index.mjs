import express from 'express';
import cors from 'cors';
import mongoose from './config/db.mjs';
import { PORT } from './config/enviroment.mjs';
import setupRoutes from './routes/index.mjs'; // Import your routes setup
import Message from './models/Message.mjs';
import http from 'http';
import { Server } from 'socket.io';



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for testing purposes
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true // Allow credentials if necessary
  }
});


export let connectedDrivers = {};
const users = {}; // Change this to an object instead of an array
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
app.use("/", setupRoutes(io)); // Pass io to setupRoutes

mongoose.connection
  .once('open', () => console.log('Connected to DB'))
  .on('error', (err) => console.log('Error connecting DB -->', err));

// Call setupRoutes with the io instance


io.on('connection', (socket) => {
  console.log("New connection:", socket.id);

  socket.on('userJoined', ({ userInfo }) => {
    users[socket.id] = userInfo; // Use an object to map user info to socket IDs
    console.log(`${userInfo} has joined with ID ${socket.id}`);
    socket.emit('Welcome', { user: 'Admin', message: 'Welcome to the chat!' });
  });

  socket.on("message", async ({ message }) => {
    const userId = users[socket.id]; // Get the user associated with this socket
    const newMessage = new Message({
      user: userId, // Save the user ID or username
      message: message
    });

    try {
      await newMessage.save(); // Save the message
      io.emit('messagesent', { user: userId, message, id: socket.id }); // Emit the new message
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  });
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (driverId) => {
    connectedDrivers[driverId] = socket.id; // Track connected drivers
    console.log(`Driver ${driverId} connected`);

    socket.on('disconnect', () => {
      delete connectedDrivers[driverId]; // Remove on disconnect
      console.log(`Driver ${driverId} disconnected`);
    });
  });
});

export {io};

// Start server
server.listen(PORT, () => {
  console.log('Server running on port' + PORT);
});




// import express from 'express';
// import cors from 'cors';
// import mongoose from './config/db.mjs';
// import setupRoutes from './routes/index.mjs'; // Import your routes setup
// import http from 'http';
// import { Server } from 'socket.io';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server,{
//   cors: {
//     origin: 'http://localhost:3000', // Frontend ka address daalna zaroori hai
//     methods: ['GET', 'POST'],
//     credentials: true
//   }
// });

// // Store connected drivers and passengers
// export const connectedDrivers = {}; // Export connected drivers
// export const connectedPassengers = {}; // Export connected passengers

// app.use(express.json())
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST'], // Jitne bhi methods allow karne hain, unhe add karo
//   credentials: true // Agar tumhe cookies aur headers ka istemal karna hai
// }));

// // Connect to MongoDB
// mongoose.connection
//   .once('open', () => console.log('Connected to DB'))
//   .on('error', (err) => console.log('Error connecting DB -->', err));

// // Call setupRoutes with the io instance
// app.use("/", setupRoutes(io)); // Pass io to setupRoutes

// // Socket.io connection handling
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('registerDriver', (driverId) => {
//       connectedDrivers[driverId] = socket.id;
//       console.log(`Driver connected: ${driverId}, Socket ID: ${socket.id}`);
//   });

//   // Example for handling passenger connection
//   socket.on('registerPassenger', (passengerId) => {
//       connectedPassengers[passengerId] = socket.id;
//       console.log(`Passenger connected: ${passengerId}`);
//   });

//   socket.on('disconnect', () => {
//       console.log('User disconnected');
//       // Remove user from connected drivers or passengers
//       Object.keys(connectedDrivers).forEach(driverId => {
//           if (connectedDrivers[driverId] === socket.id) {
//               delete connectedDrivers[driverId];
//               console.log(`Driver disconnected: ${driverId}`);
//           }
//       });

//       Object.keys(connectedPassengers).forEach(passengerId => {
//           if (connectedPassengers[passengerId] === socket.id) {
//               delete connectedPassengers[passengerId];
//               console.log(`Passenger disconnected: ${passengerId}`);
//           }
//       });
//   });
// });

// export { io }; // Ensure io is exported

// // Start server
// server.listen(3001, () => {
//   console.log('Server running on port 3001');
// });
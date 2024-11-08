// import express from 'express';
// import mongoose from 'mongoose'; 
// import { authenticateToken } from '../middleWare/authenticateToken.mjs';
// import PublishTrip from '../models/PublishTrip.mjs';
// import BookingHistory from '../models/BookingHistory.mjs';

// const router = express.Router();

// router.get('/tripBooking/bookingHistory', authenticateToken, async (req, res) => {
//     try {
//         const passengerId = req.passengerId; // Ensure this is set correctly
//         console.log("Passenger ID:", passengerId); // Check if passengerId is being set

//         const history = await BookingHistory.find({ passengerId }).populate('tripId'); // Fetch booking history
//         console.log("Booking History:", history); // Log the booking history

//         if (!history) {
//             return res.status(404).json({ message: 'No booking history found' });
//         }

//         res.send({ data: history });
//     } catch (error) {
//         console.error('Error fetching booking history:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });
//  export default router
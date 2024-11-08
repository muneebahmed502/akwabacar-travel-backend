import express from 'express';
import mongoose from 'mongoose'; 
import { authenticateToken } from '../middleWare/authenticateToken.mjs';
import BookingTrip from '../models/BookingTrip.mjs';
import Notification from '../models/Notification.mjs';
import PublishTrip from '../models/PublishTrip.mjs';
import BookingHistory from '../models/BookingHistory.mjs';
import { io, connectedDrivers } from '../index.mjs';

const router = express.Router();

router.post('/booking', authenticateToken, async (req, res) => {
    try {
        const { passengerName, passengerEmail, passengerPhoneNumber, tripId } = req.body;

        // Fetch the trip to get the driverId and available seats
        const trip = await PublishTrip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check if there are available seats
        if (trip.selectAvailableSeats <= 0) {
            return res.status(400).json({ message: 'All seats are booked' });
        }

        // Save the booking in the database
        const newBooking = new BookingTrip({
            passengerName,
            passengerEmail,
            passengerPhoneNumber,
            passengerId: req.passengerId,
            tripId,
            // status: 'pending'  // Set initial status as 'booked'
        });
        
        await newBooking.save();

        const newBookingHistory = new BookingHistory({
            passengerId: req.passengerId,
            tripId,
            tripDetails: {
                collectDriverName: trip.collectDriverName,
                pickupLocation: trip.pickupLocation,
                dropoffLocation: trip.dropoffLocation,
                selectedDate: trip.selectedDate,
                selectedTime: trip.selectedTime,
            },
        });
        await newBookingHistory.save();

        // Decrease available seats by 1
        const updatedSeats = trip.selectAvailableSeats - 1;
        const updateFields = {
            selectAvailableSeats: updatedSeats,
        };

        // If no seats left, mark the trip as fully booked
        if (updatedSeats === 0) {
            updateFields.status = 'fully booked'; // Mark the trip as fully booked
        }

        // Update the trip with the new available seats
        await PublishTrip.findByIdAndUpdate(tripId, updateFields);

        // Create a new notification for the driver
        const newNotification = new Notification({
            tripId,
            driverId: trip.driverId,
            passengerId: req.passengerId,
            message: 'New booking request received!',
            isRead: false,
        });
        await newNotification.save(); // Save notification to the database

        // Emit notification to the driver if they are connected
        if (connectedDrivers[trip.driverId]) {
            io.to(connectedDrivers[trip.driverId]).emit('newBookingRequest', {
                tripId,
                passengerName,
                message: `New booking request for trip ${tripId}`,
                driverId: trip.driverId,
            });
        }

      




        return res.status(200).json({ message: 'Booking successful!'});
    } catch (error) {
        console.error('Error saving booking:', error);
        return res.status(500).json({ error: 'Error saving booking' });
    }
});

// Fetch booking status
router.get('/:tripId', authenticateToken, async (req, res) => {
    const { tripId } = req.params;
    const passengerId = req.passengerId; // Get passengerId from the authentication middleware
    try {
        const booking = await BookingTrip.findOne({ tripId: String(tripId), passengerId });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ status: booking.status });
    } catch (error) {
        console.error('Error fetching booking status:', error.message); // Improved error logging
        res.status(500).json({ message: 'Server error' });
    }
});

// Get notifications for a driver
router.get('/notifications/:driverId', authenticateToken, async (req, res) => {
    const driverId = req.driverId;
    console.log('Received request for notifications for driverId:', driverId);

    try {
        const notifications = await Notification.find({ driverId: driverId });
        console.log('Notifications found:', notifications);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});


// Accept Booking
router.post('/acceptBooking', authenticateToken, async (req, res) => {
    const { tripId, passengerId } = req.body; // Make sure passengerId is correctly retrieved

    try {
        const booking = await BookingTrip.findOneAndUpdate(
            { tripId, passengerId },
            { status: 'booked' },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Notification removal after accepting
        await Notification.findOneAndDelete({ tripId, passengerId });

        io.to(req.driverId).emit('bookingUpdated', {
            tripId,
            status: 'booked',
        });

        return res.status(200).json({ message: 'Booking accepted', status: 'booked' });
    } catch (error) {
        console.error('Error accepting booking:', error);
        return res.status(500).json({ error: 'Error accepting booking' });
    }
});

// Decline Booking
router.post('/declineBooking', authenticateToken, async (req, res) => {
    const { tripId, passengerId } = req.body; // Make sure passengerId is correctly retrieved

    try {
        const booking = await BookingTrip.findOneAndUpdate(
            { tripId, passengerId },
            { status: 'canceled' },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Notification removal after declining
        await Notification.findOneAndDelete({ tripId, passengerId });

        io.to(req.driverId).emit('bookingUpdated', {
            tripId,
            status: 'canceled',
        });

        return res.status(200).json({ message: 'Booking declined', status: 'canceled' });
    } catch (error) {
        console.error('Error declining booking:', error);
        return res.status(500).json({ error: 'Error declining booking' });
    }
});

router.get('/bookingHistory/:passengerId', authenticateToken, async (req, res) => {
    try {
        const passengerId = req.passengerId; // Ensure this is set correctly
        console.log("Passenger ID:", passengerId); // Check if passengerId is being set

        const history = await BookingHistory.find({ passengerId }).populate('tripId'); // Fetch booking history
        console.log("Booking History:", history); // Log the booking history

        if (!history) {
            return res.status(404).json({ message: 'No booking history found' });
        }

        res.send({ data: history });
    } catch (error) {
        console.error('Error fetching booking history:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



export default router;

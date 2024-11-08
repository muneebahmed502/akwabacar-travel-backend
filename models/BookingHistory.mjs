// models/BookingHistory.mjs
import mongoose from 'mongoose';

const bookingHistorySchema = new mongoose.Schema({
    passengerId: {
        type: String
    },
    tripId: { type: String, required: true },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    tripDetails: {
        collectDriverName: { type: String },
        pickupLocation:{
            lat: {
                type: Number,
              },
              lng: {
                type: Number,
              },
        },
        dropoffLocation: {
            lat: {
                type: Number,
              },
              lng: {
                type: Number,
              }, 
        },
        selectedDate: { type: Date },
        selectedTime: {
            selectedHour:{
                type: Number
            },
            selectedMinute:{
                type: Number
            }
        }
    }
    // status: {
    //     type: String,
    //     enum: ['booked', 'cancelled', 'completed'], // Adjust statuses as needed
    //     required: true,
    // },
});

const BookingHistory = mongoose.model('BookingHistory', bookingHistorySchema);

export default BookingHistory;

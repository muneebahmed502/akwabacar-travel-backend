import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookingTripSchema = new Schema({
    tripId: { type: String, required: true },
    passengerName: {
        type: String,
        required: true,
    },
    passengerEmail: {
        type: String,
        required: true,
        trim: true,
    },
    passengerPhoneNumber: {
        type: String,
        required: true,
    },
    passengerId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'booked', 'canceled'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const BookingTrip = mongoose.model('BookingTrip', bookingTripSchema);
export default BookingTrip;

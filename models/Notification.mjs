import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PublishTrip',
        required: true,
    },
    driverId: {
        type: String,
        required: true,
    },
    passengerId: {
        type: String, // New field to store the passenger ID
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;

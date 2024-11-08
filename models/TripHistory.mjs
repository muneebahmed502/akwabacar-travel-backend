import mongoose from 'mongoose';

const tripHistorySchema = new mongoose.Schema({
    DriverId: {
        type: String
    },
    tripId: { type: String, required: true },
    TripPublishDate: {
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
});

const TripHistory = mongoose.model('TripHistory', tripHistorySchema);

export default TripHistory;

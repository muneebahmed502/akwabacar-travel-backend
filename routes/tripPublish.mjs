import express from 'express';
import PublishTrip from '../models/PublishTrip.mjs';
import { io } from '../index.mjs';
import { authenticateToken } from '../middleWare/authenticateToken.mjs';
import TripHistory from '../models/TripHistory.mjs';
import { translateResponse } from '../middleWare/translateMessage.mjs';

const router = express.Router();
// router.use(translateResponse);

// Get all trips
router.get('/', async (req, res) => {
    try {
        const tripPublish = await PublishTrip.find({ status: { $ne: 'booked' } });
        res.send({ message: 'Users fetched successfully', data: tripPublish });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching trips', error: error.message });
    }
});

// Get trip by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const tripPublish = await PublishTrip.findById(id).exec();
        if (tripPublish) {
            res.send({ message: 'Trip fetched successfully', data: tripPublish });
        } else {
            res.status(404).send({ message: 'Trip not found' });
        }
    } catch (e) {
        res.status(500).send({ message: 'Error fetching trip', error: e.message });
    }
});

router.post("/addTrip",authenticateToken,async (req, res) => {
    try {
        const {
            collectDriverName,
            collectDriverNote,
            collectDriverPhoneNumber,
            pickupLocation,
            dropoffLocation,
            selectAirConditionerPermission,
            selectAvailableSeats,
            selectCarModel,
            selectPaymentMethod,
            selectPermissionReturnTrip,
            selectPrice,
            selectReturnTripDetail,
            selectedAllowPets,
            selectedAllowSong,
            selectedCarColor,
            selectedDate,
            selectedTime,
            whichCar,
           
        } = req.body;

        const convertYesNoToBoolean = (value) => value.toLowerCase() === 'yes';

        const preparedData = {
            collectDriverName,
            collectDriverNote,
            collectDriverPhoneNumber,
            pickupLocation,
            dropoffLocation,
            selectAirConditionerPermission: convertYesNoToBoolean(selectAirConditionerPermission),
            selectAvailableSeats,
            selectCarModel,
            selectPaymentMethod,
            selectPermissionReturnTrip,
            selectPrice,
            selectReturnTripDetail,
            selectedAllowPets: convertYesNoToBoolean(selectedAllowPets),
            selectedAllowSong: convertYesNoToBoolean(selectedAllowSong),
            selectedCarColor,
            selectedDate,
            selectedTime,
            whichCar,
           
            driverId: req.driverId,
        };

        const newTrip = new PublishTrip(preparedData);
        await newTrip.save();

        const newTripHistory = new TripHistory({
            DriverId: req.driverId,
            tripId: newTrip._id, 
            tripDetails: {
                collectDriverName: newTrip.collectDriverName,
                pickupLocation: newTrip.pickupLocation,
                dropoffLocation: newTrip.dropoffLocation,
                selectedDate: newTrip.selectedDate,
                selectedTime: newTrip.selectedTime,
            },
        });
        await newTripHistory.save();

        io.emit('newTrip', newTrip);
        res.status(201).send({ message: 'Trip added successfully', data: newTrip });
    } catch (error) {
        console.error('Error adding trip:', error);
        res.status(500).send({ message: 'Failed to add Trip', error: error.message });
    }
});


router.get('/tripHistory/:driverId', authenticateToken, async (req, res) => {
    try {
        const DriverId = req.driverId; // Ensure this is set correctly
        console.log("Passenger ID:", DriverId); // Check if passengerId is being set

        const history = await TripHistory.find({ DriverId }).populate('tripId') // Fetch booking history
        console.log("Booking History:", history); // Log the booking history

        if (!history) {
            return res.status(404).json({ message: 'No Trip history found' });
        }

        res.send({ data: history });
    } catch (error) {
        console.error('Error fetching booking history:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router; // Export the router instance directly  

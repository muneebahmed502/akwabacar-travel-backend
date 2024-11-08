import mongoose from 'mongoose';
const { Schema } = mongoose;

const publishTripSchema = new Schema({
  pickupLocation: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
      // required: true, // Required field
    },
  },
  dropoffLocation: {
    lat: {
      type: Number,
      // required: true, // Required field
    },
    lng: {
      type: Number,
      // required: true, // Required field
    },
  },
  selectedDate: {
    type: Date,
    // required: true, // Required field
  },
  selectedTime: {
    selectedHour: {
      type: Number,
      // required: true, // Required field
    },
    selectedMinute: {
      type: Number,
      // required: true, // Required field
    },
  },
  whichCar: {
    type: String,
    // required: true, // Required field
  },
  selectCarModel: {
    type: String,
    // required: true, // Required field
  },
  selectedCarColor: {
    type: String,
    // required: true, // Required field
  },
  selectedAllowPets: {
    type: Boolean,
    // default: false, // Default to false
  },
  selectedAllowSong: {
    type: Boolean,
    // default: false, // Default to false
  },
  selectAvailableSeats: {
    type: Number,
    // required: true, // Required field
  },
  selectPrice: {
    type: Number,
    // required: true, // Required field
  },
  selectPaymentMethod: {
    type: String,
    // required: true, // Required field
  },
  selectAirConditionerPermission: {
    type: Boolean,
    // default: false, // Default to false
  },
  selectPermissionReturnTrip: {
    type: Boolean,
    // required: true, // Required field
  },
  selectReturnTripDetail: {
    returnSelectedDate: {
      type: Date,
      // required: function () {
      //   return this.selectPermissionReturnTrip; // Required if permission is true
      // },
    },
    returnSelectedTime: {
      selectedHour: {
        type: Number,
        // required: function () {
        //   return this.selectPermissionReturnTrip; // Required if permission is true
        // }, 
            },
      selectedMinute: {
        type: Number,
        // required: function () {
        //   return this.selectPermissionReturnTrip; // Required if permission is true
        // },
      },
    },
    selectedReturnPrice: {
      type: Number,
      // required: function () {
      //   return this.selectPermissionReturnTrip; // Required if permission is true
      // },
    },
  },
  collectDriverName: {
    type: String,
    // required: true, // Required field
  },
  collectDriverPhoneNumber: {
    type: String,
    // required: true,  // Required field
  },
  collectDriverNote: {
    type: String,
    // required: true, // Required field
  },
  driverId: {
    type: String, // or ObjectId if you are referencing a User model
  // required: true,   // or false, depending on your use case
},

  role: { // Naya field
    type:String,
    default:'driver'
    // required: true, // Required field agar aap chahein
  },
  status: {
    type: String,
    enum: ['active', 'disabled'], // Add other statuses if needed
    default: 'active', // Set default status
},
});

const PublishTrip = mongoose.model('PublishTrip', publishTripSchema);

export default PublishTrip;
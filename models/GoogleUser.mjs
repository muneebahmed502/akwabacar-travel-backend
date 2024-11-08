import mongoose from "mongoose";
const { Schema } = mongoose;

const googleSchema = new Schema({
    // googleId: {
    //     type: String,
    // },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    image: {
        type: String,
    },
    role: { type: String, default: 'passenger' } 
})
const googleUser = mongoose.model('users',googleSchema);
export default googleUser
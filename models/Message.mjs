import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

const Message = mongoose.model('messages', messageSchema);
export default Message
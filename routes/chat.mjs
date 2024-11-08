import express from 'express';
import Message from '../models/Message.mjs'; // Make sure this path is correct

const router = express.Router();

// Route to fetch all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find(); // Retrieve all messages
    res.status(200).json(messages); // Send them as JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;

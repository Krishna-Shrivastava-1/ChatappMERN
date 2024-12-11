import express from 'express'
import Message from '../Models/Message.js';
import User from '../Models/User.js';


const app = express

const router = app.Router()


router.post('/messages', async (req, res) => {
    try {
        const { message, senderId, receiverId } = req.body;  // Extract message data from the request

        // Save the message to the database
        const newMessage = new Message({
            message,  // The actual message
            senderId,  // The ID of the sender
            receiverId,  // The ID of the receiver
        });

        await newMessage.save();  // Save the message to the database

        // Respond with the saved message
        res.status(200).json({ success: true, message: 'Message sent and saved!', data: newMessage });
    } catch (error) {
        console.log(error)
    }
})

// Get messages based on senderId and receiverId
router.get('/messages/:senderId/:receiverId', async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        // Fetch messages between senderId and receiverId
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 }); // Sort by creation time to maintain message order

        res.status(200).json({ success: true, messages }); // Send the fetched messages
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
    }
});






export default router

const express = require('express');
const router = express.Router();
const { createNotification } = require('../controllers/notificationController');

// @desc    Submit a support request
// @route   POST /api/support
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, orderId, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide name, email and message' });
        }

        // 1. Create a notification for Admin
        // Formatting the message for notification
        // We include the full message so admin can read it directly from notification
        const notificationMsg = `New Support Request from ${name} (${email})${orderId ? ` [Order #${orderId}]` : ''}:\n\n${message}`;

        await createNotification({
            message: notificationMsg,
            type: 'system', // or 'alert'
            isAdmin: true,
            relatedId: orderId || null // Link to order if present
            // We could perhaps store the full message in a separate DB structure if needed, 
            // but for now, we leave it as a notification. 
            // Ideally, we'd have a SupportTicket model, but complying with "Only ADD customer care features... Website should continue working".
        });

        // 2. We could send an email here using nodemailer (real world), 
        // but for this task, just acknowledging success is enough.

        res.status(200).json({ message: 'Support request received successfully' });
    } catch (error) {
        console.error('Support request error:', error);
        res.status(500).json({ message: 'Server error processing support request' });
    }
});

module.exports = router;

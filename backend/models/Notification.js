const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // If null, it's a global notification (for all users) or specific to roles
    },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['order', 'system', 'offer', 'alert'],
        default: 'system'
    },
    isGlobal: { type: Boolean, default: false }, // If true, shown to all users
    isAdmin: { type: Boolean, default: false }, // If true, shown to all admins
    relatedId: { type: String }, // e.g., Order ID or Product ID
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // For global/admin notifications
    isRead: { type: Boolean, default: false } // For individual notifications
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

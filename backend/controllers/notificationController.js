const Notification = require('../models/Notification');

// Helper to create notification (internal use)
const createNotification = async ({ user, message, type, isGlobal, isAdmin, relatedId }) => {
    try {
        await Notification.create({
            user,
            message,
            type,
            isGlobal: isGlobal || false,
            isAdmin: isAdmin || false,
            relatedId
        });
    } catch (error) {
        console.error('Notification creation failed:', error);
    }
};

const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const isAdmin = req.user.isAdmin;

        let query = {
            $or: [
                { user: userId }, // Direct notifications
                { isGlobal: true } // Global notifications
            ]
        };

        if (isAdmin) {
            query.$or.push({ isAdmin: true });
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);

        // Map to add 'read' status for global/admin ones
        const result = notifications.map(notif => {
            let isRead = notif.isRead;
            if (notif.isGlobal || notif.isAdmin) {
                isRead = notif.readBy.includes(userId);
            }
            return {
                ...notif.toObject(),
                isRead
            };
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notifId = req.params.id;
        const userId = req.user._id;

        const notification = await Notification.findById(notifId);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (notification.isGlobal || notification.isAdmin) {
            if (!notification.readBy.includes(userId)) {
                notification.readBy.push(userId);
            }
        } else {
            // Direct notification
            if (notification.user.toString() !== userId.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            notification.isRead = true;
        }

        await notification.save();
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const isAdmin = req.user.isAdmin;

        // 1. Update individual notifications
        await Notification.updateMany(
            { user: userId, isRead: false },
            { isRead: true }
        );

        // 2. Update global/admin notifications
        // This is complex for "mark all", usually we just fetch all appropriate unread globals and add user to readBy
        let globalQuery = {
            $or: [{ isGlobal: true }]
        };
        if (isAdmin) globalQuery.$or.push({ isAdmin: true });

        // Find those NOT read by user yet
        const unreadGlobals = await Notification.find({
            ...globalQuery,
            readBy: { $ne: userId }
        });

        for (const notif of unreadGlobals) {
            notif.readBy.push(userId);
            await notif.save();
        }

        res.json({ message: 'All notifications marked as read' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead
};

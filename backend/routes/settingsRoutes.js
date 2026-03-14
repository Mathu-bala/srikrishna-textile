const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all public settings
router.get('/', async (req, res) => {
    try {
        const themeColor = await Settings.findOne({ key: 'themeColor' });
        res.json({
            themeColor: themeColor ? themeColor.value : 'purple'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update settings (Admin only)
router.put('/', protect, admin, async (req, res) => {
    try {
        const { themeColor } = req.body;
        
        if (themeColor) {
            await Settings.findOneAndUpdate(
                { key: 'themeColor' },
                { value: themeColor },
                { upsert: true, new: true }
            );
        }

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

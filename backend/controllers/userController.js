const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            phone: user.phone,
            address: user.address,
            profilePhoto: user.profilePhoto,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.phone !== undefined) user.phone = req.body.phone;
        if (req.body.address !== undefined) user.address = req.body.address;
        if (req.body.profilePhoto !== undefined) user.profilePhoto = req.body.profilePhoto;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            phone: updatedUser.phone,
            address: updatedUser.address,
            profilePhoto: updatedUser.profilePhoto,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const generateToken = (id) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// @desc    Get user preferences
// @route   GET /api/user/preferences
// @access  Private
const getUserPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json(user.preferences || { themeColor: 'purple', mode: 'dark' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user preferences
// @route   POST /api/user/preferences
// @access  Private
const updateUserPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const { themeColor, mode } = req.body;

            if (themeColor) user.preferences.themeColor = themeColor;
            if (mode) user.preferences.mode = mode;

            await user.save();
            res.json(user.preferences);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserPreferences,
    updateUserPreferences,
    getUserProfile,
    updateUserProfile
};

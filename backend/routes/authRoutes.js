const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createNotification } = require('../controllers/notificationController');
const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {

            // Notify Admin
            await createNotification({
                message: `New user registered: ${user.name}`,
                type: 'system',
                isAdmin: true,
                relatedId: user._id
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            user.lastLogin = Date.now();
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Social Login (Google / Facebook via Firebase token)
// POST /api/auth/social
// Body: { name, email, photoURL, provider }
router.post('/social', async (req, res) => {
    const { name, email, photoURL, provider } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required for social login' });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // New social user — create without password
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                password: null,
                profilePhoto: photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            });

            // Notify admin about new social registration
            await createNotification({
                message: `New user via ${provider || 'social'}: ${user.name}`,
                type: 'system',
                isAdmin: true,
                relatedId: user._id,
            });
        } else {
            // Existing user — update photo if provided
            if (photoURL && user.profilePhoto !== photoURL) {
                user.profilePhoto = photoURL;
            }
            user.lastLogin = Date.now();
            await user.save();
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

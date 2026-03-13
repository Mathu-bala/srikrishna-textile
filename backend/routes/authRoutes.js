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

const { verifyGoogleToken } = require('../utils/googleAuth');

// Social Login (Google / Facebook)
// POST /api/auth/social
// Body: { credential, provider, name, email, photoURL } (Firebase legacy support)
router.post('/social', async (req, res) => {
    const { credential, provider, name, email, photoURL } = req.body;

    try {
        let userData = { name, email, photoURL };

        // If Google and we have a credential, verify it
        if (provider === 'google' && credential) {
            const googleUser = await verifyGoogleToken(credential);
            userData = {
                name: googleUser.name,
                email: googleUser.email,
                photoURL: googleUser.picture
            };
        }

        if (!userData.email) {
            return res.status(400).json({ message: 'Email is required for social login' });
        }

        let user = await User.findOne({ email: userData.email });

        if (!user) {
            // New social user — create without password
            user = await User.create({
                name: userData.name || userData.email.split('@')[0],
                email: userData.email,
                password: null,
                profilePhoto: userData.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
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
            if (userData.photoURL && user.profilePhoto !== userData.photoURL) {
                user.profilePhoto = userData.photoURL;
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
        console.error('Social Login Error:', error.message);
        res.status(500).json({ message: error.message || 'Social login failed' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { getUserPreferences, updateUserPreferences, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/preferences')
    .get(protect, getUserPreferences)
    .put(protect, updateUserPreferences);

module.exports = router;

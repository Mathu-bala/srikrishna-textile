const express = require('express');
const router = express.Router();
const {
    getInventory,
    getInventoryById,
    createInventoryItem,
    updateInventoryItem,
    adjustStock,
    getInventoryStats,
    syncInventory
} = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and admin only
router.route('/sync').post(protect, admin, syncInventory);
router.route('/').get(protect, admin, getInventory).post(protect, admin, createInventoryItem);
router.route('/stats/metrics').get(protect, admin, getInventoryStats);
router.route('/:id').get(protect, admin, getInventoryById).put(protect, admin, updateInventoryItem);
router.route('/:id/adjust').post(protect, admin, adjustStock);

module.exports = router;

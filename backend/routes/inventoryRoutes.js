const express = require('express');
const router = express.Router();
const {
    addInventory,
    getInventory,
    updateInventory,
    deleteInventory,
    searchInventory,
    getStats,
    syncFromProducts
} = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// POST /api/inventory/add
router.post('/add', protect, admin, addInventory);

// GET /api/inventory
router.get('/', protect, admin, getInventory);

// PUT /api/inventory/update/:id
router.put('/update/:id', protect, admin, updateInventory);

// DELETE /api/inventory/delete/:id
router.delete('/delete/:id', protect, admin, deleteInventory);

// GET /api/inventory/search?q=
router.get('/search', protect, admin, searchInventory);

// GET /api/inventory/stats
router.get('/stats', protect, admin, getStats);

// POST /api/inventory/sync-products
router.post('/sync-products', protect, admin, syncFromProducts);

module.exports = router;

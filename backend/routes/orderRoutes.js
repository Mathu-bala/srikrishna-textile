const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.get('/user', protect, getUserOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.get('/:id', protect, getOrderById);

module.exports = router;

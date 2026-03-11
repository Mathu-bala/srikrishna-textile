const express = require('express');
const router = express.Router();
const {
    createRazorpayOrder,
    verifyPayment,
    getRazorpayKey,
    placeCODOrder,
    validateCoupon,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// GET  /api/payment/key           → Returns Razorpay Key ID, COD status, isDemoMode
// POST /api/payment/create-order  → Creates Razorpay order (returns rzp order ID)
// POST /api/payment/verify        → Verifies signature + saves order in DB + sends email
// POST /api/payment/cod-order     → Places a Cash on Delivery order
// POST /api/payment/validate-coupon → Validates a coupon code
router.get('/key', protect, getRazorpayKey);
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/cod-order', protect, placeCODOrder);
router.post('/validate-coupon', protect, validateCoupon);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    createPaymentIntent,
    confirmPayment,
    getPublishableKey,
    handleWebhook,
    refundPayment,
} = require('../controllers/stripePaymentController');
const { protect } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────────────────────────────────────
// Stripe Payment Routes
// ─────────────────────────────────────────────────────────────────────────────

// GET  /api/stripe/key               → Returns Stripe Publishable Key
// POST /api/stripe/create-intent    → Creates Stripe Payment Intent
// POST /api/stripe/confirm-payment  → Confirms payment and saves order
// POST /api/stripe/refund           → Refunds a payment
// POST /api/stripe/webhook          → Webhook for Stripe events

router.get('/key', protect, getPublishableKey);
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);
router.post('/refund', protect, refundPayment);

// Webhook endpoint - Raw body required (no JSON parsing)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;

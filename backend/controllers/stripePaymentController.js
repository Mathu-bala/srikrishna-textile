// ─────────────────────────────────────────────────────────────────────────────
// Helper: get Stripe instance (lazy load)
// ─────────────────────────────────────────────────────────────────────────────
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY not configured');
    }
    return require('stripe')(process.env.STRIPE_SECRET_KEY);
};

const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { createNotification } = require('./notificationController');
const { sendOrderConfirmationEmail } = require('../utils/emailService');// ─────────────────────────────────────────────────────────────────────────────
// Helper: validate Stripe configuration
// ─────────────────────────────────────────────────────────────────────────────
const validateStripeConfig = () => {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
        throw new Error(
            'Stripe keys not configured. Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to backend/.env'
        );
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build and validate order items, then reduce stock
// ─────────────────────────────────────────────────────────────────────────────
const buildOrderItems = async (items) => {
    const dbOrderItems = [];
    for (const item of items) {
        const productId = item.product?.id || item.productId;
        const product = await Product.findOne({ id: productId });

        if (!product) throw new Error(`Product not found: ${productId}`);
        if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

        dbOrderItems.push({
            product: product._id,
            productId: product.id,
            quantity: item.quantity,
            size: item.size || '',
            color: item.color || '',
        });
    }
    return dbOrderItems;
};

const deductStock = async (items) => {
    for (const item of items) {
        await Product.findOneAndUpdate({ id: item.productId }, { $inc: { stock: -item.quantity } });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Create Stripe Payment Intent
// ─────────────────────────────────────────────────────────────────────────────
exports.createPaymentIntent = async (req, res) => {
    try {
        validateStripeConfig();

        const { items, totalPrice, firstName, lastName, email, shippingAddress, couponCode } = req.body;
        const userId = req.user._id;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in cart' });
        }

        // Build order items and validate
        const dbOrderItems = await buildOrderItems(items);

        // Calculate metadata for Stripe
        const metadata = {
            userId: userId.toString(),
            email,
            firstName,
            lastName,
            shippingAddress: JSON.stringify(shippingAddress),
            items: JSON.stringify(dbOrderItems),
            couponCode: couponCode || '',
        };

        // Create payment intent with metadata
        const paymentIntent = await getStripe().paymentIntents.create({
            amount: Math.round(totalPrice * 100), // Convert to cents
            currency: 'inr',
            payment_method_types: ['card'],
            metadata,
            description: `Order for ${firstName} ${lastName}`,
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Create Payment Intent Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Confirm Payment & Save Order
// ─────────────────────────────────────────────────────────────────────────────
exports.confirmPayment = async (req, res) => {
    try {
        validateStripeConfig();

        const { paymentIntentId } = req.body;
        const userId = req.user._id;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Payment Intent ID is required' });
        }

        // Retrieve payment intent from Stripe
        const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ error: 'Payment not completed' });
        }

        const { email, firstName, lastName, shippingAddress, items, couponCode } = paymentIntent.metadata;
        const dbOrderItems = JSON.parse(items);

        // Deduct stock
        await deductStock(dbOrderItems);

        // Generate order ID and estimated delivery (same pattern as Razorpay)
        const orderId = `ORD-STRIPE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

        const totalAmount = paymentIntent.amount / 100; // Convert from cents

        // Create order in database (matching Order schema exactly)
        const order = new Order({
            user: userId,
            id: orderId,
            items: dbOrderItems,
            total: totalAmount,
            shippingAddress: shippingAddress, // Keep as string (already stringified in metadata)
            status: 'placed',
            estimatedDelivery,
            paymentId: paymentIntentId,
            paymentMethod: 'Stripe',
            isPaid: true,
            couponCode: couponCode || '',
        });

        await order.save();

        // Create notification
        await createNotification({
            user: userId,
            message: `Your order #${orderId} is confirmed. Payment via Stripe.`,
            type: 'order',
            relatedId: orderId,
        });
        await createNotification({
            message: `New Stripe order: #${orderId} — ₹${totalAmount}`,
            type: 'order',
            isAdmin: true,
            relatedId: orderId,
        });

        // Send confirmation email (non-blocking)
        const user = await User.findById(userId).select('email name');
        sendOrderConfirmationEmail({
            to: user?.email || email,
            name: user?.name || `${firstName} ${lastName}`,
            orderId: orderId,
            paymentId: paymentIntentId,
            items: dbOrderItems,
            total: totalAmount,
            address: shippingAddress,
            estimatedDelivery,
        }).catch(err => console.error('[Stripe] Email failed:', err.message));

        res.json({
            success: true,
            message: 'Payment confirmed and order created',
            orderId: orderId,
            estimatedDelivery: estimatedDelivery.toISOString(),
        });
    } catch (error) {
        console.error('Confirm Payment Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Get Stripe Publishable Key
// ─────────────────────────────────────────────────────────────────────────────
exports.getPublishableKey = async (req, res) => {
    try {
        validateStripeConfig();
        res.json({
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        });
    } catch (error) {
        console.error('Get Publishable Key Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Handler for Stripe Events
// ─────────────────────────────────────────────────────────────────────────────
exports.handleWebhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!webhookSecret) {
            return res.status(400).json({ error: 'Webhook secret not configured' });
        }

        let event;
        try {
            event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err) {
            return res.status(400).json({ error: `Webhook Error: ${err.message}` });
        }

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded':
                console.log('✅ Payment succeeded:', event.data.object.id);
                break;
            case 'payment_intent.payment_failed':
                console.log('❌ Payment failed:', event.data.object.id);
                break;
            case 'charge.refunded':
                console.log('💰 Charge refunded:', event.data.object.id);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Refund Payment
// ─────────────────────────────────────────────────────────────────────────────
exports.refundPayment = async (req, res) => {
    try {
        validateStripeConfig();

        const { paymentIntentId, reason } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Payment Intent ID is required' });
        }

        const refund = await getStripe().refunds.create({
            payment_intent: paymentIntentId,
            reason: reason || 'requested_by_customer',
        });

        res.json({
            success: true,
            message: 'Refund initiated',
            refundId: refund.id,
            status: refund.status,
        });
    } catch (error) {
        console.error('Refund Error:', error);
        res.status(500).json({ error: error.message });
    }
};

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { createNotification } = require('./notificationController');
const { sendOrderConfirmationEmail, sendCODConfirmationEmail, sendAdminOrderNotificationEmail } = require('../utils/emailService');

// ─────────────────────────────────────────────────────────────────────────────
// Razorpay instance — lazy loaded so server boots even if keys are missing
// ─────────────────────────────────────────────────────────────────────────────
const getRazorpay = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === 'rzp_test_YourKeyIdHere') {
        throw new Error(
            'Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env'
        );
    }
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
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
// Helper: apply coupon (simple server-side coupons)
// ─────────────────────────────────────────────────────────────────────────────
const COUPONS = {
    'KRISHNA10': { type: 'percent', value: 10, minOrder: 500 },
    'TEXTILE20': { type: 'percent', value: 20, minOrder: 1000 },
    'FLAT50': { type: 'flat', value: 50, minOrder: 300 },
    'FLAT100': { type: 'flat', value: 100, minOrder: 600 },
    'WELCOME': { type: 'percent', value: 5, minOrder: 0 },
};

const applyCoupon = (code, subtotal) => {
    if (!code) return { discount: 0, message: null };
    const coupon = COUPONS[code.toUpperCase()];
    if (!coupon) return { discount: 0, message: 'Invalid coupon code' };
    if (subtotal < coupon.minOrder) return { discount: 0, message: `Minimum order ₹${coupon.minOrder} required` };

    const discount = coupon.type === 'percent'
        ? Math.min(Math.round(subtotal * coupon.value / 100), subtotal)
        : Math.min(coupon.value, subtotal);

    return { discount, message: `Coupon applied! ₹${discount} off` };
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Validate coupon code
// @route   POST /api/payment/validate-coupon
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const validateCoupon = async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        const result = applyCoupon(code, parseFloat(subtotal) || 0);
        if (result.message && result.discount === 0) {
            return res.status(400).json({ valid: false, message: result.message });
        }
        res.json({ valid: true, discount: result.discount, message: result.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a Razorpay order (step 1 of online payment flow)
// @route   POST /api/payment/create-order
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt, couponCode } = req.body;
        console.log('[Payment] Create order request:', { amount, currency, couponCode, userId: req.user._id });

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        // Apply coupon if provided — but we let the frontend calculate and we just verify
        const razorpay = getRazorpay();
        const options = {
            amount: Math.round(amount * 100), // paise
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: {
                userId: req.user._id.toString(),
                userEmail: req.user.email,
                coupon: couponCode || '',
            },
        };

        const razorpayOrder = await razorpay.orders.create(options);
        console.log('[Payment] ✅ Razorpay order created:', razorpayOrder.id);

        res.json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            isDemoMode: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_'),
        });
    } catch (error) {
        console.error('[Payment] ❌ Create Razorpay order error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify Razorpay signature + save order + send email
// @route   POST /api/payment/verify
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            shippingAddress,
            total,
            paymentMethod,
            couponCode,
            discount = 0,
        } = req.body;

        // 1️⃣ Verify HMAC-SHA256 signature
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed – invalid signature' });
        }

        // 2️⃣ Build + validate items
        const dbOrderItems = await buildOrderItems(items);
        await deductStock(dbOrderItems);

        // 3️⃣ Save order
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

        const order = new Order({
            user: req.user._id,
            id: orderId,
            items: dbOrderItems,
            total,
            shippingAddress,
            status: 'placed',
            estimatedDelivery,
            paymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            paymentMethod: paymentMethod || 'Razorpay',
            isPaid: true,
            couponCode: couponCode || '',
            discount: discount || 0,
        });

        const createdOrder = await order.save();
        await createdOrder.populate('items.product');
        console.log('[Payment] ✅ Order saved:', createdOrder.id, '| Payment:', razorpay_payment_id);

        // 4️⃣ Notifications
        await createNotification({
            user: req.user._id,
            message: `Your order #${createdOrder.id} is confirmed. Payment: ${razorpay_payment_id}`,
            type: 'order',
            relatedId: createdOrder.id,
        });
        await createNotification({
            message: `New paid order: #${createdOrder.id} — ₹${total}`,
            type: 'order',
            isAdmin: true,
            relatedId: createdOrder.id,
        });

        // 5️⃣ Email confirmation (non-blocking)
        const user = await User.findById(req.user._id).select('email name');
        sendOrderConfirmationEmail({
            to: user.email,
            name: user.name,
            orderId: createdOrder.id,
            paymentId: razorpay_payment_id,
            items: createdOrder.items,
            total,
            address: shippingAddress,
            estimatedDelivery,
        }).catch(err => console.error('[Payment] Email failed:', err.message));

        sendAdminOrderNotificationEmail({
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: shippingAddress, // Parsing logic mapping depends on string formatted. Note: simple string injection.
            orderId: createdOrder.id,
            total,
            paymentMethod: paymentMethod || 'Razorpay',
            items: createdOrder.items,
            orderDate: new Date(),
        }).catch(err => console.error('[Payment] Admin Email failed:', err.message));

        res.status(201).json({
            success: true,
            orderId: createdOrder.id,
            paymentId: razorpay_payment_id,
            estimatedDelivery: estimatedDelivery.toISOString(),
        });
    } catch (error) {
        console.error('[Payment] ❌ Verify payment error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Place a Cash on Delivery order (no Razorpay)
// @route   POST /api/payment/cod-order
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const placeCODOrder = async (req, res) => {
    try {
        const { items, shippingAddress, total, couponCode, discount = 0 } = req.body;

        if (!items || !shippingAddress || !total) {
            return res.status(400).json({ message: 'Missing required order data' });
        }

        const dbOrderItems = await buildOrderItems(items);
        await deductStock(dbOrderItems);

        const orderId = `ORD-COD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

        const order = new Order({
            user: req.user._id,
            id: orderId,
            items: dbOrderItems,
            total,
            shippingAddress,
            status: 'placed',
            estimatedDelivery,
            paymentMethod: 'Cash on Delivery',
            isPaid: false,
            couponCode: couponCode || '',
            discount: discount || 0,
        });

        const createdOrder = await order.save();
        await createdOrder.populate('items.product');
        console.log('[Payment] ✅ COD Order saved:', createdOrder.id);

        await createNotification({
            user: req.user._id,
            message: `Your COD order #${createdOrder.id} has been placed!`,
            type: 'order',
            relatedId: createdOrder.id,
        });
        await createNotification({
            message: `New COD order: #${createdOrder.id} — ₹${total}`,
            type: 'order',
            isAdmin: true,
            relatedId: createdOrder.id,
        });

        // Email (non-blocking)
        const user = await User.findById(req.user._id).select('email name');
        sendCODConfirmationEmail({
            to: user.email,
            name: user.name,
            orderId: createdOrder.id,
            items: createdOrder.items,
            total,
            address: shippingAddress,
            estimatedDelivery,
        }).catch(err => console.error('[Payment] COD email failed:', err.message));

        sendAdminOrderNotificationEmail({
             customerName: user.name,
             customerEmail: user.email,
             customerPhone: shippingAddress,
             orderId: createdOrder.id,
             total,
             paymentMethod: 'Cash on Delivery',
             items: createdOrder.items,
             orderDate: new Date(),
        }).catch(err => console.error('[Payment] Admin Email failed:', err.message));

        res.status(201).json({
            success: true,
            orderId: createdOrder.id,
            estimatedDelivery: estimatedDelivery.toISOString(),
        });
    } catch (error) {
        console.error('[Payment] ❌ COD order error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Check if Razorpay is configured + return public key
// @route   GET /api/payment/key
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getRazorpayKey = (req, res) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const unconfigured = !keyId || keyId === 'rzp_test_YourKeyIdHere';
    res.json({
        keyId: unconfigured ? null : keyId,
        isDemoMode: keyId?.startsWith('rzp_test_') && !unconfigured,
        configured: !unconfigured,
        codEnabled: process.env.COD_ENABLED !== 'false', // default ON
    });
};

module.exports = { createRazorpayOrder, verifyPayment, getRazorpayKey, placeCODOrder, validateCoupon };

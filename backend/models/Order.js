const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productId: { type: String, required: true }, // Keep the original string ID for frontend consistency
    quantity: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, required: true, unique: true }, // Custom order ID like ORD-XXXX
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['placed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'placed'
    },
    shippingAddress: { type: String, required: true },
    estimatedDelivery: { type: Date, required: true },
    // ─── Payment fields ────────────────────────────────────────────────────────
    paymentId: { type: String, default: '' },         // Razorpay payment_id
    razorpayOrderId: { type: String, default: '' },   // Razorpay order_id
    paymentMethod: { type: String, default: 'COD' },  // UPI, Card, Netbanking, Wallet, COD
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    couponCode: { type: String, default: '' },
    discount: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-set paidAt when payment is confirmed
orderSchema.pre('save', function () {
    if (this.isPaid && !this.paidAt) {
        this.paidAt = new Date();
    }
});

module.exports = mongoose.model('Order', orderSchema);

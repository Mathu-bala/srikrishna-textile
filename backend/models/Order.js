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
        enum: ['placed', 'processing', 'shipped', 'out-for-delivery', 'delivered'],
        default: 'placed'
    },
    shippingAddress: { type: String, required: true },
    estimatedDelivery: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    variant: {
        size: { type: String },
        color: { type: String },
        material: { type: String }
    },
    stock: {
        total: { type: Number, required: true, default: 0 }, // Physical count
        reserved: { type: Number, default: 0 }, // In active orders
        sold: { type: Number, default: 0 }, // Completed sales
        threshold: { type: Number, default: 5 } // Low stock alert level
    },
    pricing: {
        costPrice: { type: Number, required: true, default: 0 },
        sellingPrice: { type: Number, required: true, default: 0 },
        tax: { type: Number, default: 0 },
        discount: { type: Number, default: 0 }
    },
    supplier: {
        name: { type: String },
        contact: { type: String },
        invoiceNumber: { type: String },
        lastRestockDate: { type: Date }
    },
    history: [{
        action: {
            type: String,
            enum: ['restock', 'sold', 'reserved', 'adjustment', 'return', 'cancel']
        },
        quantity: { type: Number },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
        currentStock: { type: Number }, // Snapshot after action
        notes: { type: String }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for available stock
inventorySchema.virtual('availableStock').get(function () {
    return this.stock.total - this.stock.reserved;
});

// Virtual for status
inventorySchema.virtual('status').get(function () {
    if (this.availableStock <= 0) return 'Out of Stock';
    if (this.availableStock <= this.stock.threshold) return 'Low Stock';
    return 'In Stock';
});

module.exports = mongoose.model('Inventory', inventorySchema);

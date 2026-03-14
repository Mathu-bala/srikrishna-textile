const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    variant: {
        type: String,
        default: 'Standard'
    },
    stockLevel: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    totalValue: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock'],
        default: 'Out of Stock'
    }
}, {
    timestamps: true
});

// Auto Status Logic & Total Value
inventorySchema.pre('save', function () {
    this.totalValue = this.stockLevel * this.price;

    if (this.stockLevel === 0) {
        this.status = 'Out of Stock';
    } else if (this.stockLevel < 10) {
        this.status = 'Low Stock';
    } else {
        this.status = 'In Stock';
    }
});

module.exports = mongoose.model('Inventory', inventorySchema);

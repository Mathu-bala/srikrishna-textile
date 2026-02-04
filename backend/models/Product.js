const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    fabric: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 50 },
    isNew: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    searchTags: [{ type: String }],
}, { timestamps: true, suppressReservedKeysWarning: true });

module.exports = mongoose.model('Product', productSchema);

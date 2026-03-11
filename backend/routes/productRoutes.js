const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const { createNotification } = require('../controllers/notificationController');

// @desc    Fetch all products with filters
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, q, featured, new: isNew } = req.query;
        let query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        if (isNew === 'true') {
            query.isNew = true;
        }

        if (q) {
            // Split by space to handle multi-word queries like "Cotton Kurti"
            const terms = q.trim().split(/\s+/);

            // Each term must match at least one field ($and of $ors)
            query.$and = terms.map(term => {
                const regex = new RegExp(term, 'i');
                return {
                    $or: [
                        { name: regex },
                        { description: regex },
                        { category: regex },
                        { fabric: regex },
                        { colors: regex },
                        { searchTags: regex }
                    ]
                };
            });
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let product = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findOne({ 
                $or: [
                    { _id: new mongoose.Types.ObjectId(id) }, 
                    { id: id }
                ] 
            });
        } else {
            product = await Product.findOne({ id: id });
        }

        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});






// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            id, name, price, originalPrice, category, fabric,
            description, image, images, sizes, colors,
            inStock, stock, isNew, isFeatured, searchTags
        } = req.body;

        const productExists = await Product.findOne({ id });
        if (productExists) {
            return res.status(400).json({ message: 'Product already exists with this ID' });
        }

        const product = await Product.create({
            id: id || `PROD-${Date.now()}`,
            name,
            price,
            originalPrice,
            category,
            fabric: fabric || 'Cotton',
            description,
            image,
            images: images || [],
            sizes: sizes || [],
            colors: colors || [],
            inStock: inStock !== undefined ? inStock : true,
            stock: stock !== undefined ? stock : 50,
            isNew: isNew || false,
            isFeatured: isFeatured || false,
            searchTags: searchTags || []
        });


        // Notify All Users about new product
        await createNotification({
            message: `New arrival: ${name} is now available.`,
            type: 'system',
            isGlobal: true,
            relatedId: id
        });

        // Notify Admin if added with low stock? Optional.

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (product) {
            product.name = req.body.name || product.name;
            product.price = req.body.price || product.price;
            product.originalPrice = req.body.originalPrice || product.originalPrice;
            product.category = req.body.category || product.category;
            product.fabric = req.body.fabric || product.fabric;
            product.description = req.body.description || product.description;
            product.image = req.body.image || product.image;
            product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
            product.inStock = product.stock > 0;

            if (req.body.isFeatured !== undefined) product.isFeatured = req.body.isFeatured;
            if (req.body.isNew !== undefined) product.isNew = req.body.isNew;

            const updatedProduct = await product.save();

            // Check for low stock alert
            if (updatedProduct.stock < 10) {
                await createNotification({
                    message: `Low stock alert: ${updatedProduct.name} (Only ${updatedProduct.stock} left)`,
                    type: 'alert',
                    isAdmin: true,
                    relatedId: updatedProduct.id
                });
            }

            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (product) {
            await Product.deleteOne({ id: req.params.id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

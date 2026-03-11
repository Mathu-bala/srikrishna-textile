const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// @desc    Add New Stock
// @route   POST /api/inventory/add
// @access  Private/Admin
const addInventory = async (req, res) => {
    try {
        const { productId, sku, variant, stockLevel, price } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const skuExists = await Inventory.findOne({ sku });
        if (skuExists) {
            return res.status(400).json({ message: 'Inventory item with this SKU already exists' });
        }

        const inventoryItem = new Inventory({
            productId: product._id,
            productName: product.name,
            sku,
            variant: variant || 'Standard',
            stockLevel: Number(stockLevel),
            price: Number(price)
        });

        await inventoryItem.save();
        res.status(201).json(inventoryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Inventory (with pagination)
// @route   GET /api/inventory
// @access  Private/Admin
const getInventory = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const count = await Inventory.countDocuments({});
        const items = await Inventory.find({})
            .populate('productId', 'name image category')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ items, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search Inventory
// @route   GET /api/inventory/search?q=
// @access  Private/Admin
const searchInventory = async (req, res) => {
    try {
        const keyword = req.query.q
            ? {
                  $or: [
                      { sku: { $regex: req.query.q, $options: 'i' } },
                      { productName: { $regex: req.query.q, $options: 'i' } }
                  ]
              }
            : {};

        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        const count = await Inventory.countDocuments({ ...keyword });
        const items = await Inventory.find({ ...keyword })
            .populate('productId', 'name image category')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ items, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Inventory (quantity, price, variant)
// @route   PUT /api/inventory/update/:id
// @access  Private/Admin
const updateInventory = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        if (req.body.stockLevel !== undefined) {
            item.stockLevel = Number(req.body.stockLevel);
        }
        if (req.body.price !== undefined) {
            item.price = Number(req.body.price);
        }
        if (req.body.variant !== undefined) {
            item.variant = req.body.variant;
        }

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Inventory Item
// @route   DELETE /api/inventory/delete/:id
// @access  Private/Admin
const deleteInventory = async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        res.json({ message: 'Inventory removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Inventory Stats
// @route   GET /api/inventory/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const items = await Inventory.find({});
        
        const totalItemsInStock = items.length;
        const totalInventoryValue = items.reduce((acc, item) => acc + (item.totalValue || 0), 0);
        const lowStockAlerts = items.filter(item => item.status === 'Low Stock').length;
        const outOfStock = items.filter(item => item.status === 'Out of Stock').length;

        res.json({
            totalItemsInStock,
            totalInventoryValue,
            lowStockAlerts,
            outOfStock
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Sync Inventory from Products
// @route   POST /api/inventory/sync-products
// @access  Private/Admin
const syncFromProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        let syncedCount = 0;

        for (const product of products) {
            const existing = await Inventory.findOne({ productId: product._id });

            if (!existing) {
                const inventoryItem = new Inventory({
                    productId: product._id,
                    productName: product.name,
                    sku: product.sku || "SKU-" + product._id,
                    variant: product.variant || "Default",
                    stockLevel: 0,
                    price: product.price || 0
                });
                await inventoryItem.save();
                syncedCount++;
            }
        }

        const allInventory = await Inventory.find({})
            .populate('productId', 'name image category')
            .sort({ createdAt: -1 });

        res.json({ 
            message: `Products Synced Successfully. ${syncedCount} new records added.`, 
            syncedCount,
            inventory: allInventory
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addInventory,
    getInventory,
    searchInventory,
    updateInventory,
    deleteInventory,
    getStats,
    syncFromProducts
};

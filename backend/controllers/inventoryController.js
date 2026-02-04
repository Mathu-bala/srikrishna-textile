const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private/Admin
const getInventory = asyncHandler(async (req, res) => {
    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
        ? {
            $or: [
                { sku: { $regex: req.query.keyword, $options: 'i' } },
                // Populated fields usually can't be searched simply with top-level regex in one go 
                // without aggregation, but let's stick to SKU for basic search or do client-side filter
            ],
        }
        : {};

    const count = await Inventory.countDocuments({ ...keyword });
    const inventory = await Inventory.find({ ...keyword })
        .populate('product', 'name image category')
        .populate('history.user', 'name')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ updatedAt: -1 });

    res.json({ inventory, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get inventory by ID
// @route   GET /api/inventory/:id
// @access  Private/Admin
const getInventoryById = asyncHandler(async (req, res) => {
    const item = await Inventory.findById(req.params.id)
        .populate('product')
        .populate('history.user', 'name');

    if (item) {
        res.json(item);
    } else {
        res.status(404);
        throw new Error('Inventory item not found');
    }
});

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private/Admin
const createInventoryItem = asyncHandler(async (req, res) => {
    const {
        product,
        sku,
        variant,
        stock,
        pricing,
        supplier
    } = req.body;

    const itemExists = await Inventory.findOne({ sku });

    if (itemExists) {
        res.status(400);
        throw new Error('Inventory item with this SKU already exists');
    }

    const inventoryItem = await Inventory.create({
        product,
        sku,
        variant,
        stock,
        pricing,
        supplier,
        history: [{
            action: 'restock',
            quantity: stock.total,
            user: req.user._id,
            currentStock: stock.total,
            notes: 'Initial Stock'
        }]
    });

    if (inventoryItem) {
        // Optionally update Product total CountInStock if mapped 1:1 or aggregate
        res.status(201).json(inventoryItem);
    } else {
        res.status(400);
        throw new Error('Invalid inventory data');
    }
});

// @desc    Update inventory (General Edit)
// @route   PUT /api/inventory/:id
// @access  Private/Admin
const updateInventoryItem = asyncHandler(async (req, res) => {
    const item = await Inventory.findById(req.params.id);

    if (item) {
        item.variant = req.body.variant || item.variant;
        item.stock.threshold = req.body.stock?.threshold || item.stock.threshold;
        item.pricing = req.body.pricing || item.pricing;
        item.supplier = req.body.supplier || item.supplier;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

// @desc    Adjust Stock (Restock / Damage / Correction)
// @route   POST /api/inventory/:id/adjust
// @access  Private/Admin
const adjustStock = asyncHandler(async (req, res) => {
    const { action, quantity, notes } = req.body;
    const item = await Inventory.findById(req.params.id);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    const qty = Number(quantity);
    let newTotal = item.stock.total;

    if (action === 'restock') {
        newTotal += qty;
        if (item.supplier) {
            item.supplier.lastRestockDate = Date.now();
        }
    } else if (action === 'adjustment' || action === 'damage' || action === 'theft') {
        // Adjustment usually implies correction. If negative passed, deduct. 
        // If explicit action 'damage', deduct.
        // Let's assume input 'quantity' is absolute value, and action determines sign.
        if (action === 'restock') {
            newTotal += qty;
        } else {
            newTotal -= qty;
        }
    } else if (action === 'return') {
        newTotal += qty; // Stock comes back
    }

    // Prevent negative
    if (newTotal < 0) {
        res.status(400);
        throw new Error('Stock cannot go negative');
    }

    item.stock.total = newTotal;

    item.history.push({
        action,
        quantity: qty,
        user: req.user._id,
        date: Date.now(),
        currentStock: newTotal,
        notes
    });

    const updatedItem = await item.save();
    res.json(updatedItem);
});

// @desc    Get Inventory Stats
// @route   GET /api/inventory/stats/metrics
// @access  Private/Admin
const getInventoryStats = asyncHandler(async (req, res) => {
    const totalItems = await Inventory.countDocuments({});

    // Aggregate for sums
    const stats = await Inventory.aggregate([
        {
            $group: {
                _id: null,
                totalStockValue: { $sum: { $multiply: ["$stock.total", "$pricing.costPrice"] } },
                totalStockCount: { $sum: "$stock.total" },
                // Simple low stock count based on a fixed logic or need lookup
            }
        }
    ]);

    // Low stock query
    // Since threshold is in the document, we can compare fields
    const lowStockCount = await Inventory.countDocuments({
        $expr: { $lte: ["$stock.total", "$stock.threshold"] }
    });

    const outOfStockCount = await Inventory.countDocuments({
        "stock.total": { $lte: 0 }
    });

    res.json({
        totalProductVariants: totalItems,
        totalStockValue: stats[0]?.totalStockValue || 0,
        totalStockCount: stats[0]?.totalStockCount || 0,
        lowStockCount,
        outOfStockCount
    });
});

// @desc    Sync Inventory from Products
// @route   POST /api/inventory/sync
// @access  Private/Admin
const syncInventory = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    let syncedCount = 0;

    for (const product of products) {
        const exists = await Inventory.findOne({ product: product._id });
        if (!exists) {
            await Inventory.create({
                product: product._id,
                sku: `SKU-${product._id.toString().slice(-6).toUpperCase()}`,
                variant: {
                    size: product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : 'Standard',
                    color: product.colors && product.colors.length > 0 ? product.colors.join(', ') : 'Standard',
                },
                stock: {
                    total: product.stock !== undefined ? product.stock : 0,
                    reserved: 0,
                    threshold: 5
                },
                pricing: {
                    costPrice: Math.round((product.price || 0) * 0.7),
                    sellingPrice: product.price || 0
                },
                status: 'active', // Note: status is virtual in schema but putting 'active' string here doesn't hurt as placeholder or ignored
                history: [{
                    action: 'restock',
                    quantity: product.stock !== undefined ? product.stock : 0,
                    user: req.user ? req.user._id : null, // Handle case where req.user might be missing if auth fails but middleware should catch it
                    currentStock: product.stock !== undefined ? product.stock : 0,
                    notes: 'Initial Sync from Product'
                }]
            });
            syncedCount++;
        }
    }

    res.json({ message: `Synced ${syncedCount} new items from Products.` });
});

module.exports = {
    getInventory,
    getInventoryById,
    createInventoryItem,
    updateInventoryItem,
    adjustStock,
    getInventoryStats,
    syncInventory
};

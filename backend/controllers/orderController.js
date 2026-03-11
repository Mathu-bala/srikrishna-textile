const Order = require('../models/Order');
const { createNotification } = require('./notificationController');
const Product = require('../models/Product');
const sendOrderEmails = require('../utils/sendOrderEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            total
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const dbOrderItems = [];

        // 1. Check stock and build order items with references
        for (const item of items) {
            // Frontend sends item.product which contains the id
            const productId = item.product.id;
            const product = await Product.findOne({ id: productId });

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product.name}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            dbOrderItems.push({
                product: product._id,
                productId: product.id,
                quantity: item.quantity,
                size: item.size,
                color: item.color
            });
        }

        // 2. Reduce stock
        for (const item of dbOrderItems) {
            await Product.findOneAndUpdate(
                { id: item.productId },
                { $inc: { stock: -item.quantity } }
            );
        }

        // 3. Create order
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // 7 days from now

        const order = new Order({
            user: req.user._id,
            id: orderId,
            items: dbOrderItems,
            total: total,
            shippingAddress: shippingAddress,
            status: 'placed',
            estimatedDelivery: estimatedDelivery
        });

        const createdOrder = await order.save();

        // Populate product details for the response so frontend can display them immediately if needed
        await createdOrder.populate('items.product');

        // Notify User
        await createNotification({
            user: req.user._id,
            message: `Your order #${createdOrder.id} has been placed successfully.`,
            type: 'order',
            relatedId: createdOrder.id
        });

        // Notify Admin
        await createNotification({
            message: `New order received: #${createdOrder.id}`,
            type: 'order',
            isAdmin: true,
            relatedId: createdOrder.id
        });

        // Send Emails (Non-blocking)
        const paymentMethod = req.body.paymentMethod || 'COD';
        
        sendOrderEmails({
            _id: createdOrder.id,
            customerName: req.user.name,
            customerEmail: req.user.email,
            totalAmount: total,
            paymentMethod: paymentMethod
        }).catch(err => console.error('Error sending order emails:', err));

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/user
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('items.product'); // Necessary to show product details in history
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findOne({ id: req.params.id });

        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();

            // Notify User about status update
            // Capitalize first letter of status for display
            const statusDisplay = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            await createNotification({
                user: order.user,
                message: `Your order #${order.id} is now ${statusDisplay}`,
                type: 'order',
                relatedId: order.id
            });

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        // Find by custom 'id' string (e.g., ORD-12345678)
        const order = await Order.findOne({ id: req.params.id })
            .populate('user', 'name email')
            .populate('items.product');

        if (order) {
            // Check if user is owner or admin
            if (order.user && order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const createTestOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find admin user or any user to assign order to
        let user = await User.findOne({ email: 'admin@example.com' });
        if (!user) {
            user = await User.findOne({});
        }

        if (!user) {
            console.log('No users found. Creating dummy user.');
            user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                isAdmin: false
            });
        }

        // Find a product
        const product = await Product.findOne({});
        if (!product) {
            console.log('No products found to order.');
            process.exit(1);
        }

        // Create Order
        const orderId = `ORD-${Date.now()}`;

        // Check if order already exists (unlikely with timestamp)

        const order = await Order.create({
            user: user._id,
            id: orderId,
            items: [{
                product: product._id,
                productId: product.id,
                quantity: 1,
                size: 'M',
                color: 'Red'
            }],
            total: product.price || 999,
            shippingAddress: '123 Test St, Test City, 12345, Country',
            status: 'placed',
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        console.log(`Test Order Created: ${order.id} for User: ${user.name}`);
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createTestOrder();

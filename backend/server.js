const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow requests from the Vercel frontend (and localhost for dev)
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL, // e.g. https://srikrishna-textile.vercel.app
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, mobile apps, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Allow any *.vercel.app preview URL
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));

// ── Body Parsers ─────────────────────────────────────────────────────────────
// Stripe webhook needs raw body — must come BEFORE express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishna-textile')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes       = require('./routes/authRoutes');
const adminRoutes      = require('./routes/adminRoutes');
const userRoutes       = require('./routes/userRoutes');
const orderRoutes      = require('./routes/orderRoutes');
const productRoutes    = require('./routes/productRoutes');

app.use('/api/auth',          authRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/user',          userRoutes);
app.use('/api/orders',        orderRoutes);
app.use('/api/products',      productRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/support',       require('./routes/supportRoutes'));
app.use('/api/inventory',     require('./routes/inventoryRoutes'));
app.use('/api/stripe',        require('./routes/stripeRoutes'));
app.use('/api/payment',       require('./routes/paymentRoutes'));

// ── Product search ─────────────────────────────────────────────────────────
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        const products = await Product.find({
            $or: [
                { name:       { $regex: q, $options: 'i' } },
                { category:   { $regex: q, $options: 'i' } },
                { searchTags: { $regex: q, $options: 'i' } },
            ],
        })
            .select('name category image price')
            .limit(8);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── Health check (Render pings this to wake the service) ─────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`   FRONTEND_URL : ${process.env.FRONTEND_URL || '(not set)'}`);
    console.log(`   Stripe       : ${process.env.STRIPE_SECRET_KEY ? '✅ configured' : '❌ missing STRIPE_SECRET_KEY'}`);
});

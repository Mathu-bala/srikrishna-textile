const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const missingCategories = [
    {
        keyword: 'Chinos',
        category: 'mens',
        baseName: 'Slim Fit Chinos',
        images: ['pants-beige-chinos.jpg', 'pants-navy-formal.jpg'],
        fabrics: ['Cotton', 'Cotton Blend'],
        desc: 'Stylish chinos for casual and formal wear.'
    },
    {
        keyword: 'Chikankari',
        category: 'kurtis',
        baseName: 'Chikankari Embroidered Kurti',
        images: ['kurti-white-chikankari.jpg', 'kurti-pink-embroidered.jpg', 'kurti1.jpg'],
        fabrics: ['Georgette', 'Cotton', 'Chiffon'],
        desc: 'Traditional Lucknow Chikankari embroidery work.'
    },
    {
        keyword: 'Banarasi',
        category: 'sarees',
        baseName: 'Banarasi Silk Saree',
        images: ['saree-banarasi-red.jpg', 'saree2.jpg'], // Using existing images as placeholders
        fabrics: ['Silk', 'Banarasi Silk'],
        desc: 'Authentic Banarasi silk saree with zari work.'
    },
    {
        keyword: 'Kids Lehenga',
        category: 'kids',
        baseName: 'Pattu Pavadai Lehenga',
        images: ['kids-girl-lehenga.jpg', 'pavada-set-1.jpg'],
        fabrics: ['Silk', 'Satin'],
        desc: 'Beautiful lehenga choli set for kids.'
    },
    {
        keyword: 'Linen',
        category: 'mens',
        baseName: 'Pure Linen Shirt',
        images: ['shirt-white-linen.jpg', 'fabric-linen-beige.jpg'],
        fabrics: ['Linen'],
        desc: 'Breathable linen shirt for summer.'
    }
];

const seedMissing = async () => {
    await connectDB();
    try {
        const products = [];

        for (const type of missingCategories) {
            // Create 5 variants for each
            for (let i = 1; i <= 5; i++) {
                const img = type.images[(i - 1) % type.images.length] || type.images[0];
                const color = ['Beige', 'White', 'Pink', 'Blue', 'Green', 'Red', 'Yellow'][i % 7];

                products.push({
                    id: `btn-${type.keyword.toLowerCase()}-${i}-${Date.now()}`,
                    name: `${color} ${type.baseName}`,
                    price: 800 + i * 150,
                    originalPrice: 1200 + i * 200,
                    category: type.category,
                    fabric: type.fabrics[i % type.fabrics.length],
                    description: `${type.desc} Available in ${color}.`,
                    image: img,
                    images: [img],
                    sizes: ['S', 'M', 'L', 'XL'],
                    colors: [color],
                    inStock: true,
                    isNew: i < 2,
                    isFeatured: true,
                    rating: 4.5,
                    reviews: 10 + i,
                    searchTags: [type.keyword, type.keyword.toLowerCase(), type.category, color.toLowerCase()],
                    stock: 20
                });
            }
        }

        await Product.insertMany(products);
        console.log(`Added ${products.length} products for missing buttons (Chinos, Chikankari, etc.)`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedMissing();

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

const fabricImages = [
    'fabric-brocade-gold.jpg',
    'fabric-cotton-white.jpg',
    'fabric-linen-beige.jpg',
    'fabric-silk-maroon.jpg',
    'kids-girl-dress.jpg', // Using as fabric pattern reference
    'kurta-cream-ethnic.jpg', // Using as fabric texture
    'saree-blue-banarasi.jpg', // Using as silk fabric
    'shirt-blue-formal.jpg' // Using as shirt fabric
];

const targetGroups = ['Children', 'Women', 'Men', 'Grandfather', 'Grandmother'];

const materialTypes = [
    'Cotton material', 'Silk material', 'Linen material', 'Khadi material',
    'Wool blend material', 'Polyester blend', 'Handloom material',
    'Printed cotton material', 'Plain cotton material', 'Festival special material'
];

const colors = ['White', 'Cream', 'Beige', 'Blue', 'Maroon', 'Green', 'Yellow', 'Pink', 'Grey', 'Black'];

const generateProducts = async () => {
    await connectDB();

    try {
        // Clear existing fabric products if any specific ones exist, or proceed to just add new ones.
        // We'll delete products in 'fabrics' category to regenerate clean set.
        await Product.deleteMany({ category: 'fabrics' });
        console.log('Cleared existing fabric products.');

        const productsToInsert = [];
        const targetCount = 60; // 50+ as requested

        for (let i = 0; i < targetCount; i++) {
            const group = targetGroups[i % targetGroups.length]; // Distribute evenly
            const material = materialTypes[Math.floor(Math.random() * materialTypes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];

            let name = '';
            let description = '';
            let image = '';

            // Customize based on group
            if (group === 'Children') {
                name = `Soft ${material.split(' ')[0]} Material - Kids`;
                description = `Soft and safe ${material.toLowerCase()} suitable for stitching kids dresses, frocks, or shirts.`;
                image = 'kids-girl-dress.jpg'; // Patterned
            } else if (group === 'Women') {
                name = `Designer ${material.split(' ')[0]} Fabric - Women`;
                description = `Premium ${material.toLowerCase()} perfect for sarees, kurtis, or salwar suits.`;
                image = ['fabric-silk-maroon.jpg', 'fabric-brocade-gold.jpg'][Math.floor(Math.random() * 2)];
            } else if (group === 'Men') {
                name = `Premium ${material.split(' ')[0]} Shirting - Men`;
                description = `High quality ${material.toLowerCase()} for formal or casual shirts and pants.`;
                image = ['shirt-blue-formal.jpg', 'fabric-linen-beige.jpg'][Math.floor(Math.random() * 2)];
            } else if (group === 'Grandfather') {
                name = `Traditional ${material.split(' ')[0]} Fabric - Elders`;
                description = `Comfortable and breathable ${material.toLowerCase()}, ideal for dhotis, kurtas, or shirts.`;
                image = 'fabric-cotton-white.jpg';
            } else if (group === 'Grandmother') {
                name = `Handloom ${material.split(' ')[0]} Cloth - Elders`;
                description = `Soft, lightweight ${material.toLowerCase()} suitable for comfortable sarees or blouses.`;
                image = 'fabric-linen-beige.jpg';
            }

            // Append color to name to make it unique
            name = `${name} - ${color}`;

            // Image fallback if specific logic didn't catch (shouldn't happen but safe)
            if (!image) image = fabricImages[Math.floor(Math.random() * fabricImages.length)];

            productsToInsert.push({
                id: `fabric-${i + 1}`,
                name: name,
                price: Math.floor(Math.random() * (2000 - 300 + 1)) + 300, // 300 to 2000 per meter/piece
                originalPrice: Math.floor(Math.random() * (3000 - 500 + 1)) + 500,
                category: 'fabrics', // New category
                fabric: material.split(' ')[0], // 'Cotton', 'Silk', etc.
                description: description,
                image: image,
                images: [image],
                sizes: ['1 Meter', '2 Meters', '2.5 Meters', '5 Meters'], // Sold by length
                colors: [color],
                inStock: true,
                isNew: Math.random() > 0.8,
                isFeatured: Math.random() > 0.9,
                rating: (Math.random() * (5 - 4) + 4).toFixed(1),
                reviews: Math.floor(Math.random() * 50),
                searchTags: ['fabric', 'material', 'cloth', 'textile', group.toLowerCase(), material.toLowerCase(), color.toLowerCase()].filter(Boolean),
                stock: Math.floor(Math.random() * 100) + 10
            });
        }

        await Product.insertMany(productsToInsert);
        console.log(`Successfully inserted ${productsToInsert.length} fabric products.`);
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

generateProducts();

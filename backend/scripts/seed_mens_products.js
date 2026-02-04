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

const shirtImages = [
    'shirt-blue-formal.jpg',
    'shirt-white-linen.jpg',
    'kurta-cream-ethnic.jpg',
    'mens1.jpg'
];

const pantImages = [
    'pants-beige-chinos.jpg',
    'pants-navy-formal.jpg'
];

// Reusing some textures/fabrics for broader categories if needed, or stick to what we have.
// We have to reuse images heavily to get to 100+ products with limited assets.
const genericMenImages = [...shirtImages, ...pantImages];

const categories = [
    'Rough dress',
    'Shirt',
    'Pant',
    'Shorts',
    'Hoodies',
    'Sports dress',
    'Inner wear',
    'Vesti',
    'Shirt + Vesti Combo',
    'Scarf',
    'Socks',
    'Tie'
];

const subCategories = {
    'Shirt': ['Half hand shirt', 'Full hand shirt', 'Formal shirt', 'Casual shirt', 'Checked shirt', 'Plain shirt'],
    'Pant': ['Formal pant', 'Cotton pant', 'Jeans pant', 'Slim fit pant'],
    'Vesti': ['Kaili vesti', 'Kavi vesti', 'Function vesti']
};

const colors = ['Blue', 'White', 'Black', 'Grey', 'Green', 'Red', 'Beige', 'Navy'];
const fabrics = ['Cotton', 'Linen', 'Polyester', 'Blend', 'Denim', 'Silk'];

const generateProducts = async () => {
    await connectDB();

    try {
        // Delete existing Men's products first to avoid duplicates or mixed states?
        // Or just append? User asked to "Update the Men's Wear browsing experience to display a large... catalog"
        // Safe to delete existing 'mens' category products and regenerate fresh 100+.
        await Product.deleteMany({ category: 'mens' });
        console.log('Cleared existing men\'s products.');

        const productsToInsert = [];
        const targetCount = 120; // Aim for a bit more than 100

        for (let i = 0; i < targetCount; i++) {
            // Pick a main category
            const mainCat = categories[Math.floor(Math.random() * categories.length)];

            // Pick subcategory if exists
            let subCat = '';
            if (subCategories[mainCat]) {
                subCat = subCategories[mainCat][Math.floor(Math.random() * subCategories[mainCat].length)];
            }

            const color = colors[Math.floor(Math.random() * colors.length)];
            const fabric = fabrics[Math.floor(Math.random() * fabrics.length)];

            const name = subCat ? `${color} ${fabric} ${subCat}` : `${color} ${mainCat}`;
            const price = Math.floor(Math.random() * (3000 - 500 + 1)) + 500; // 500 to 3000

            // Determine image based on category type
            let image = '';
            if (mainCat.includes('Shirt') || mainCat.includes('Kurta')) {
                image = shirtImages[Math.floor(Math.random() * shirtImages.length)];
            } else if (mainCat.includes('Pant')) {
                image = pantImages[Math.floor(Math.random() * pantImages.length)];
            } else if (mainCat === 'Vesti') {
                // Use fabric or white/cream assets for vesti lookalike if exact not available
                image = 'fabric-cotton-white.jpg';
            } else {
                // Fallback for accessories/others
                image = genericMenImages[Math.floor(Math.random() * genericMenImages.length)];
            }

            // Fix fallback if image missing (should exist based on local assets check earlier)
            if (!image) image = 'shirt-white-linen.jpg';

            productsToInsert.push({
                id: `mens-${i + 1}`,
                name: name,
                price: price,
                originalPrice: price + Math.floor(Math.random() * 1000),
                category: 'mens',
                fabric: fabric,
                description: `Premium quality ${name.toLowerCase()} for men. Comfortable fit and stylish look for any occasion.`,
                image: image,
                images: [image],
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                colors: [color],
                inStock: true,
                isNew: Math.random() > 0.8,
                isFeatured: Math.random() > 0.9,
                rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
                reviews: Math.floor(Math.random() * 100),
                searchTags: ['men', 'mens', 'male', mainCat.toLowerCase(), subCat.toLowerCase().split(' ').pop() || '', color.toLowerCase(), fabric.toLowerCase()].filter(Boolean),
                stock: Math.floor(Math.random() * 50) + 10
            });
        }

        await Product.insertMany(productsToInsert);
        console.log(`Successfully inserted ${productsToInsert.length} men's products.`);
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

generateProducts();

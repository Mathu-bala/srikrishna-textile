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

const boysImages = [
    'kids-boy-kurta.jpg',
    'kurta-cream-ethnic.jpg', // Ethnic
    'shirt-white-linen.jpg', // Shirt
    'pants-beige-chinos.jpg', // Pants/Shorts
    'shirt-blue-formal.jpg'
];

const girlsImages = [
    'kids-girl-dress.jpg',
    'kids-girl-lehenga.jpg',
    'kurti-yellow-printed.jpg', // Dress/Frock
    'kurti-pink-palazzo-set.jpg', // Ethnic/Lehenga
    'kurti-maroon-anarkali.jpg' // Party wear
];

const infantImages = [
    'fabric-cotton-white.jpg', // Soft cotton
    'kids-girl-dress.jpg',
    'kids-boy-kurta.jpg'
];

const categories = {
    'Boys': [
        'Boy kurta', 'Shirt & pant set', 'Shorts', 'T-shirt',
        'Ethnic wear', 'Festival wear', 'Casual wear', 'Sports wear'
    ],
    'Girls': [
        'Girl frock', 'Girl lehenga', 'Girl choli set', 'Traditional dress',
        'Party wear dress', 'Cotton dress', 'Festival wear'
    ],
    'Infants': [
        'Baby dress', 'Baby frock', 'Baby ethnic wear'
    ]
};

const colors = ['Pink', 'Blue', 'Yellow', 'Red', 'Green', 'White', 'Orange', 'Purple', 'Cream'];
const fabrics = ['Cotton', 'Silk', 'Denim', 'Velvet', 'Net', 'Georgette', 'Linen'];
const occasions = ['Party', 'Casual', 'Festival', 'Wedding', 'Summer', 'Winter'];

const generateProducts = async () => {
    await connectDB();

    try {
        // Clear existing kids products
        await Product.deleteMany({ category: 'kids' });
        console.log('Cleared existing kids products.');

        const productsToInsert = [];
        const targetCount = 110;

        for (let i = 0; i < targetCount; i++) {
            // Select Group (Boys, Girls, Infants)
            const groupKeys = Object.keys(categories);
            const group = groupKeys[Math.floor(Math.random() * groupKeys.length)];
            const subCats = categories[group];
            const type = subCats[Math.floor(Math.random() * subCats.length)];

            // Select Image
            let image;
            if (group === 'Boys') {
                if (type.includes('Kurta') || type.includes('Ethnic') || type.includes('Festival')) {
                    image = ['kids-boy-kurta.jpg', 'kurta-cream-ethnic.jpg'][Math.floor(Math.random() * 2)];
                } else if (type.includes('Shirt') || type.includes('Casual')) {
                    image = ['shirt-white-linen.jpg', 'shirt-blue-formal.jpg'][Math.floor(Math.random() * 2)];
                } else if (type.includes('Shorts') || type.includes('Pant')) {
                    image = 'pants-beige-chinos.jpg';
                } else {
                    image = boysImages[Math.floor(Math.random() * boysImages.length)];
                }
            } else if (group === 'Girls') {
                if (type.includes('Lehenga') || type.includes('Choli')) {
                    image = 'kids-girl-lehenga.jpg';
                } else if (type.includes('Frock') || type.includes('Dress') || type.includes('Cotton')) {
                    image = ['kids-girl-dress.jpg', 'kurti-yellow-printed.jpg'][Math.floor(Math.random() * 2)];
                } else {
                    image = girlsImages[Math.floor(Math.random() * girlsImages.length)];
                }
            } else {
                image = infantImages[Math.floor(Math.random() * infantImages.length)];
            }

            const color = colors[Math.floor(Math.random() * colors.length)];
            const fabric = fabrics[Math.floor(Math.random() * fabrics.length)];
            const occasion = occasions[Math.floor(Math.random() * occasions.length)];

            const productName = `${group === 'Infants' ? 'Infant' : group} ${occasion} ${type} - ${color}`;

            productsToInsert.push({
                id: `kids-${i + 1}`,
                name: productName,
                price: Math.floor(Math.random() * (4000 - 400 + 1)) + 400,
                originalPrice: Math.floor(Math.random() * (6000 - 1000 + 1)) + 1000,
                category: 'kids',
                fabric: fabric,
                description: `Comfortable and stylish ${type.toLowerCase()} for ${group.toLowerCase()}. Perfect for ${occasion.toLowerCase()} occasions. Soft ${fabric.toLowerCase()} fabric.`,
                image: image,
                images: [image],
                sizes: group === 'Infants' ? ['0-3M', '3-6M', '6-12M', '12-18M'] : ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-8Y', '8-10Y'],
                colors: [color],
                inStock: true,
                isNew: Math.random() > 0.7,
                isFeatured: Math.random() > 0.9,
                rating: (Math.random() * (5 - 4) + 4).toFixed(1),
                reviews: Math.floor(Math.random() * 50),
                searchTags: ['kids', 'children', 'baby', 'boy', 'girl', 'infant', group.toLowerCase(), type.toLowerCase(), color.toLowerCase(), fabric.toLowerCase(), occasion.toLowerCase()].filter(Boolean),
                stock: Math.floor(Math.random() * 60) + 10
            });
        }

        await Product.insertMany(productsToInsert);
        console.log(`Successfully inserted ${productsToInsert.length} kids products.`);
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

generateProducts();

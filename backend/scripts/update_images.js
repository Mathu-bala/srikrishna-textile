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

const sareeImages = [
    'saree-black-gold.jpg',
    'saree-blue-banarasi.jpg',
    'saree-green-cotton.jpg',
    'saree-maroon-patola.jpg',
    'saree-peach-organza.jpg',
    'saree-pink-chiffon.jpg',
    'saree-purple-georgette.jpg',
    'saree-red-silk.jpg'
];

const kurtiImages = [
    'kurti-maroon-anarkali.jpg',
    'kurti-navy-silk.jpg',
    'kurti-pink-palazzo-set.jpg',
    'kurti-teal-cotton.jpg',
    'kurti-white-chikankari.jpg',
    'kurti-yellow-printed.jpg'
];

const mensImages = [
    'shirt-blue-formal.jpg',
    'shirt-white-linen.jpg',
    'pants-beige-chinos.jpg',
    'pants-navy-formal.jpg',
    'kurta-cream-ethnic.jpg'
];

const kidsImages = [
    'kids-boy-kurta.jpg',
    'kids-girl-dress.jpg',
    'kids-girl-lehenga.jpg'
];

const fabricImages = [
    'fabric-brocade-gold.jpg',
    'fabric-cotton-white.jpg',
    'fabric-linen-beige.jpg',
    'fabric-silk-maroon.jpg'
];

const updateImages = async () => {
    await connectDB();

    try {
        const products = await Product.find({});
        console.log(`Found ${products.length} products`);

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            let imageList = [];

            if (product.category === 'sarees') imageList = sareeImages;
            else if (product.category === 'kurtis') imageList = kurtiImages;
            else if (product.category === 'mens') imageList = mensImages;
            else if (product.category === 'kids') imageList = kidsImages;
            else if (product.category === 'fabrics') imageList = fabricImages;

            // Fallback
            if (imageList.length === 0) imageList = sareeImages;

            // Pick randomly
            const randomImage = imageList[Math.floor(Math.random() * imageList.length)];

            product.image = randomImage;
            product.images = [randomImage];

            await product.save();
            console.log(`Updated ${product.name} with ${randomImage}`);
        }

        console.log('All products updated successfully');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

updateImages();

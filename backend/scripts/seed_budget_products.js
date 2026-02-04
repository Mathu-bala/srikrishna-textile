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

const budgetProductData = [
    { name: "Daily Wear Cotton Saree - Green", image: "saree-green-cotton.jpg", category: "sarees", price: 449, original: 599 },
    { name: "Printed Kurti - Yellow", image: "kurti-yellow-printed.jpg", category: "kurtis", price: 399, original: 499 }, // Will adjust to 400
    { name: "Casual Check Shirt - Blue", image: "shirt-blue-formal.jpg", category: "mens", price: 549, original: 799 },
    { name: "Kids Cotton Frock - Pink", image: "kids-girl-dress.jpg", category: "kids", price: 499, original: 699 },
    { name: "Plain Cotton Fabric - White", image: "fabric-cotton-white.jpg", category: "fabrics", price: 400, original: 550 },
    { name: "Floral Print Handkerchief Set", image: "fabric-linen-beige.jpg", category: "accessories", price: 400, original: 550 },
    { name: "Summer Cool Blue Kurti", image: "kurti-teal-cotton.jpg", category: "kurtis", price: 599, original: 899 },
    { name: "Synthetic Saree - Daily Use", image: "saree-blue-banarasi.jpg", category: "sarees", price: 480, original: 650 },
    { name: "Men's Cotton Dhoti", image: "fabric-cotton-white.jpg", category: "mens", price: 450, original: 600 },
    { name: "Kids Night Wear Set", image: "kids-girl-lehenga.jpg", category: "kids", price: 550, original: 800 }
];

const generateBudgetProducts = async () => {
    await connectDB();

    try {
        const productsToInsert = [];

        for (let i = 0; i < budgetProductData.length; i++) {
            const item = budgetProductData[i];
            // Enforce strictly >= 400
            let finalPrice = item.price < 400 ? 400 : item.price;

            // Generate discount
            const discount = Math.round(((item.original - finalPrice) / item.original) * 100);

            productsToInsert.push({
                id: `budget-${i + 1}-${Date.now()}`,
                name: item.name,
                price: finalPrice,
                originalPrice: item.original,
                category: item.category,
                fabric: 'Cotton Blend', // Budget friendly material
                description: `Affordable ${item.name} for daily use. Best quality at best price.`,
                image: item.image,
                images: [item.image],
                sizes: ['S', 'M', 'L', 'XL'],
                colors: [item.name.split('-').pop().trim()],
                inStock: true,
                isNew: Math.random() > 0.5,
                isFeatured: true, // Mark as featured so they show up on home page
                rating: (Math.random() * (4.8 - 4.0) + 4.0).toFixed(1),
                reviews: Math.floor(Math.random() * 50) + 10,
                searchTags: ['budget', 'daily wear', 'affordable', item.category],
                stock: 100
            });
        }

        await Product.insertMany(productsToInsert);
        console.log(`Successfully added ${productsToInsert.length} budget friendly products.`);
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

generateBudgetProducts();

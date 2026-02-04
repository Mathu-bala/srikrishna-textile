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

const handkerchiefs = [
    {
        name: "Pure Cotton Handkerchief - White",
        description: "Soft and absorbent 100% cotton handkerchief for daily use.",
        image: "fabric-cotton-white.jpg",
        price: 150,
        originalPrice: 200
    },
    {
        name: "Soft Cotton Hand Harchip - Checkered",
        description: "Classic checkered pattern handkerchief, soft on skin.",
        image: "fabric-linen-beige.jpg",
        price: 180,
        originalPrice: 250
    },
    {
        name: "Printed Handkerchief - Floral",
        description: "Beautiful floral print handkerchief for women.",
        image: "fabric-brocade-gold.jpg",
        price: 200,
        originalPrice: 300
    },
    {
        name: "Daily Use Cotton Handkerchief - Set of 3",
        description: "Value pack of 3 soft cotton handkerchiefs.",
        image: "fabric-cotton-white.jpg",
        price: 350,
        originalPrice: 450
    }
];

const pavadas = [
    {
        name: "Traditional Pavada Blouse Set - Silk",
        description: "Elegant silk pavada and blouse set for festivals.",
        image: "kids-girl-lehenga.jpg",
        price: 1200,
        originalPrice: 1800,
        category: "kids"
    },
    {
        name: "Festival Wear Pavada Set - Green",
        description: "Bright green pavada set with golden border.",
        image: "saree-green-cotton.jpg",
        price: 1500,
        originalPrice: 2200,
        category: "kids"
    },
    {
        name: "New Model Silk Pavada - Designer Blouse",
        description: "Trendy new model pavada with designer blouse work.",
        image: "saree-blue-banarasi.jpg",
        price: 2500,
        originalPrice: 3500,
        category: "women"
    },
    {
        name: "Cotton Pavada with Contrast Blouse",
        description: "Comfortable cotton pavada with contrasting blouse color.",
        image: "kurti-yellow-printed.jpg",
        price: 950,
        originalPrice: 1300,
        category: "kids"
    },
    {
        name: "Kids Pavada Blouse Set - Pink",
        description: "Cute pink pavada blouse set for little girls.",
        image: "kids-girl-lehenga.jpg",
        price: 1100,
        originalPrice: 1500,
        category: "kids"
    },
    {
        name: "Party Wear Pavada Set - Maroon",
        description: "Rich maroon pavada set perfect for parties and weddings.",
        image: "kurti-maroon-anarkali.jpg",
        price: 2800,
        originalPrice: 4000,
        category: "women"
    }
];

const addProducts = async () => {
    await connectDB();

    try {
        const productsToInsert = [];

        // Handkerchiefs
        handkerchiefs.forEach((item, index) => {
            productsToInsert.push({
                id: `hanky-${index + 1}`,
                name: item.name,
                price: item.price,
                originalPrice: item.originalPrice,
                category: "accessories",
                fabric: "Cotton",
                description: item.description,
                image: item.image,
                images: [item.image],
                sizes: ["Standard"],
                colors: ["White", "Beige", "Printed"],
                inStock: true,
                isNew: true,
                rating: 4.5,
                reviews: 10 + index,
                searchTags: ["handkerchief", "hanky", "harchip", "cotton", "accessory"],
                stock: 100
            });
        });

        // Pavadas
        pavadas.forEach((item, index) => {
            productsToInsert.push({
                id: `pavada-${index + 1}`,
                name: item.name,
                price: item.price,
                originalPrice: item.originalPrice,
                category: item.category,
                fabric: item.name.includes("Silk") ? "Silk" : "Cotton",
                description: item.description,
                image: item.image,
                images: [item.image],
                sizes: ["S", "M", "L", "XL"],
                colors: ["Pink", "Green", "Blue", "Maroon", "Yellow"],
                inStock: true,
                isNew: true,
                isFeatured: index < 2,
                rating: 4.8,
                reviews: 20 + index,
                searchTags: ["pavada", "blouse", "set", "lehenga", "skirt", "top", "traditional", item.category],
                stock: 50
            });
        });

        // Use insertMany with ordered: false to continue if dupes found (though IDs are unique prefixes here)
        // Actually, we want to append. 
        await Product.insertMany(productsToInsert);
        console.log(`Successfully added ${productsToInsert.length} new products.`);
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

addProducts();


const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const featuredProducts = [
    {
        name: "Red Kanchipuram Silk Saree",
        category: "sarees",
        price: 11012,
        originalPrice: 13765,
        rating: 4.8,
        reviews: 120,
        isNew: true,
        isFeatured: true, // IMPORTANT
        inStock: true,
        stock: 50,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
        description: "Elegant Red Kanchipuram Silk Saree perfect for weddings and festive occasions.",
        fabric: "Silk",
        sizes: ["Free Size"],
        colors: ["Red", "Gold"],
        searchTags: "red saree, kanchipuram, silk, wedding"
    },
    {
        name: "Blue Banarasi Cotton Saree",
        category: "sarees",
        price: 18581,
        originalPrice: 23226,
        rating: 4.1,
        reviews: 85,
        isNew: true,
        isFeatured: true,
        inStock: true,
        stock: 30,
        image: "https://images.unsplash.com/photo-1610030469668-9655bc896d00",
        description: "Traditional Blue Banarasi Cotton Saree for a sophisticated look.",
        fabric: "Cotton",
        sizes: ["Free Size"],
        colors: ["Blue", "Silver"],
        searchTags: "blue saree, banarasi, cotton"
    },
    {
        name: "Pink Patola Chiffon Saree",
        category: "sarees",
        price: 10691,
        originalPrice: 13363,
        rating: 4.1,
        reviews: 92,
        isNew: true,
        isFeatured: true,
        inStock: true,
        stock: 45,
        image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431", // Adjusted image
        description: "Lightweight and stylish Pink Patola Chiffon Saree.",
        fabric: "Chiffon",
        sizes: ["Free Size"],
        colors: ["Pink"],
        searchTags: "pink saree, patola, chiffon"
    },
    {
        name: "Green Chanderi Georgette Saree",
        category: "sarees",
        price: 14717,
        rating: 4.3,
        reviews: 64,
        isNew: true,
        isFeatured: true,
        inStock: true,
        stock: 25,
        image: "https://images.unsplash.com/photo-1583391726247-128c682705fe",
        description: "Beautiful Green Chanderi Georgette Saree with intricate designs.",
        fabric: "Georgette",
        sizes: ["Free Size"],
        colors: ["Green", "Gold"],
        searchTags: "green saree, chanderi, georgette"
    }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishna-textile')
    .then(async () => {
        console.log('Connected to MongoDB');

        for (const p of featuredProducts) {
            // Update if exists, or insert
            await Product.findOneAndUpdate(
                { name: p.name },
                p,
                { upsert: true, new: true }
            );
            console.log(`Processed: ${p.name}`);
        }

        console.log('Featured products seeded successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

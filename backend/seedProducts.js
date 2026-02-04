const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
    {
        id: 'f1',
        name: "Red Kanchipuram Silk Saree",
        category: "sarees",
        price: 11012,
        originalPrice: 13765,
        rating: 4.8,
        reviews: 120,
        isNew: true,
        isFeatured: true,
        inStock: true,
        stock: 50,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
        description: "Elegant Red Kanchipuram Silk Saree perfect for weddings and festive occasions.",
        fabric: "Silk",
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c"],
        sizes: ["Free Size"],
        colors: ["Red", "Gold"],
        searchTags: ["red", "kanchipuram", "silk"]
    },
    {
        id: 'f2',
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
        images: ["https://images.unsplash.com/photo-1610030469668-9655bc896d00"],
        sizes: ["Free Size"],
        colors: ["Blue", "Silver"],
        searchTags: ["blue", "banarasi", "cotton"]
    },
    {
        id: 'f3',
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
        image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431",
        description: "Lightweight and stylish Pink Patola Chiffon Saree.",
        fabric: "Chiffon",
        images: ["https://images.unsplash.com/photo-1620799140408-ed5341cd2431"],
        sizes: ["Free Size"],
        colors: ["Pink"],
        searchTags: ["pink", "patola", "chiffon"]
    },
    {
        id: 'f4',
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
        description: "Beautiful Green Chanderi Georgette Saree.",
        fabric: "Georgette",
        images: ["https://images.unsplash.com/photo-1583391726247-128c682705fe"],
        sizes: ["Free Size"],
        colors: ["Green"],
        searchTags: ["green", "chanderi"]
    }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishna-textile')
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            for (const product of products) {
                await Product.findOneAndUpdate(
                    { id: product.id },
                    product,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
                console.log(`Seeded: ${product.name}`);
            }
            console.log('Seeding complete!');
            process.exit(0);
        } catch (error) {
            console.error('Seeding error:', error);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

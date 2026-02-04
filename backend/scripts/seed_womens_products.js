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
    'saree-red-silk.jpg',
    'saree1.jpg'
];

const kurtiImages = [
    'kurti-maroon-anarkali.jpg',
    'kurti-navy-silk.jpg',
    'kurti-pink-palazzo-set.jpg',
    'kurti-teal-cotton.jpg',
    'kurti-white-chikankari.jpg',
    'kurti-yellow-printed.jpg'
];

const westernDressImages = [
    'kurti-maroon-anarkali.jpg', // Gown look
    'kurti-yellow-printed.jpg', // Printed dress
    'kurti-teal-cotton.jpg', // Casual dress
    'kurti-white-chikankari.jpg', // White dress/top
    'fabric-silk-maroon.jpg', // Solid dress/top
    'fabric-cotton-white.jpg' // White top
];

const bottomImages = [
    'pants-navy-formal.jpg', // Jeans/Jeggings/Trousers
    'pants-beige-chinos.jpg', // Beige pants/Skirt
    'kurti-pink-palazzo-set.jpg' // Skirt/Palazzo
];

const indianCategories = [
    'Saree', 'Kurti', 'Salwar suit', 'Palazzo set', 'Lehenga', 'Ethnic set', 'Festival wear', 'Function wear'
];

const westernCategories = [
    'Western dress', 'Long gown', 'Party gown', 'Casual dress', 'Bodycon dress', 'Maxi dress', 'Midi dress',
    'Tops', 'Crop tops', 'Skirts', 'Jeans', 'Jeggings', 'Shrugs', 'Jackets', 'Co-ord sets'
];

const subCategories = {
    'Saree': ['Silk saree', 'Cotton saree', 'Banarasi saree', 'Party saree', 'Traditional saree', 'Wedding saree', 'Plain saree', 'Designer saree'],
    'Kurti': ['Short kurti', 'Long kurti', 'Anarkali kurti', 'Printed kurti', 'Embroidered kurti'],
    'Western dress': ['Floral dress', 'Solid dress', 'Summer dress'],
    'Long gown': ['Evening gown', 'Party gown', 'Wedding gown']
};

const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Black', 'White', 'Maroon', 'Teal', 'Beige', 'Gold', 'Silver'];
const fabrics = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Crepe', 'Rayon', 'Denim', 'Linen', 'Velvet', 'Net', 'Organza'];

const generateProducts = async () => {
    await connectDB();

    try {
        // Clear existing women's products
        // Note: The previous men's seed deleted specifically 'mens' category. 
        // We should check if existing products have 'sarees' or 'kurtis' category and clear them or redefine them.
        // To be safe and clean, we will delete anything that looks like women's wear or categorize them under 'sarees', 'kurtis' main ID but here we are using 'womens' as broad context, but specific categories were asked.
        // Wait, the user asked for categories: "Include all the following categories: ... Indian Wear ... Western Wear".
        // In the data model we have a single `category` field.
        // I will use distinct categories for filtering: 'sarees', 'kurtis', 'western', 'lehenga', etc.
        // But to make them searchable as "Women's Wear", I might need a specific identifier or just rely on search tags and names.
        // The prompt says: "When the user clicks 'Women’s Wear' ... Redirect to Products page." (implying a filter or all products view).
        // I'll stick to 'sarees', 'kurtis', 'western', 'lehenga', 'bottoms' as `category` field values, and add 'women' tag.

        await Product.deleteMany({ category: { $in: ['sarees', 'kurtis', 'western', 'lehenga', 'bottoms', 'ethnic', 'gowns'] } });
        console.log('Cleared existing women\'s products.');

        const productsToInsert = [];
        const targetCount = 130;

        for (let i = 0; i < targetCount; i++) {
            const isIndian = Math.random() > 0.4; // 60% Indian, 40% Western
            let mainCat, subCat = '', img;

            if (isIndian) {
                mainCat = indianCategories[Math.floor(Math.random() * indianCategories.length)];
                if (subCategories[mainCat]) {
                    subCat = subCategories[mainCat][Math.floor(Math.random() * subCategories[mainCat].length)];
                } else {
                    subCat = mainCat; // Fallback
                }

                // Select Image
                if (mainCat === 'Saree') {
                    img = sareeImages[Math.floor(Math.random() * sareeImages.length)];
                } else if (mainCat === 'Lehenga') {
                    // Use kurti palazzo or similar generic
                    img = 'kurti-pink-palazzo-set.jpg';
                } else {
                    img = kurtiImages[Math.floor(Math.random() * kurtiImages.length)];
                }
            } else {
                mainCat = westernCategories[Math.floor(Math.random() * westernCategories.length)];
                subCat = mainCat;

                if (['Jeans', 'Jeggings', 'Skirts'].includes(mainCat)) {
                    img = bottomImages[Math.floor(Math.random() * bottomImages.length)];
                } else {
                    img = westernDressImages[Math.floor(Math.random() * westernDressImages.length)];
                }
            }

            const color = colors[Math.floor(Math.random() * colors.length)];
            const fabric = fabrics[Math.floor(Math.random() * fabrics.length)];

            // Construct Name
            const productName = subCat && subCat !== mainCat
                ? `${color} ${fabric} ${subCat}`
                : `${color} ${fabric} ${mainCat}`;

            // Determine specific category ID for URL filtering
            let categoryId = 'western';
            if (mainCat === 'Saree') categoryId = 'sarees';
            else if (mainCat === 'Kurti' || mainCat === 'Salwar suit') categoryId = 'kurtis';
            else if (mainCat === 'Lehenga' || mainCat === 'Ethnic set') categoryId = 'lehenga';
            else if (['Jeans', 'Jeggings', 'Skirts'].includes(mainCat)) categoryId = 'bottoms';

            productsToInsert.push({
                id: `women-${i + 1}`,
                name: productName,
                price: Math.floor(Math.random() * (8000 - 800 + 1)) + 800,
                originalPrice: Math.floor(Math.random() * (12000 - 2000 + 1)) + 2000,
                category: categoryId,
                fabric: fabric,
                description: `Elegant ${productName.toLowerCase()} for the modern woman. Perfect for special occasions or daily wear.`,
                image: img,
                images: [img],
                sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                colors: [color],
                inStock: true,
                isNew: Math.random() > 0.7,
                isFeatured: Math.random() > 0.85,
                rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
                reviews: Math.floor(Math.random() * 200),
                searchTags: ['women', 'womens', 'ladies', 'girl', mainCat.toLowerCase(), subCat.toLowerCase(), color.toLowerCase(), fabric.toLowerCase(), categoryId].filter(Boolean),
                stock: Math.floor(Math.random() * 80) + 5
            });
        }

        await Product.insertMany(productsToInsert);
        console.log(`Successfully inserted ${productsToInsert.length} women's products.`);
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

generateProducts();

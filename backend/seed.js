const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishna-textile')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Image paths
const sareeImages = [
    '/products/saree-red-silk.jpg',
    '/products/saree-blue-banarasi.jpg',
    '/products/saree-pink-chiffon.jpg',
    '/products/saree-green-cotton.jpg',
    '/products/saree-purple-georgette.jpg',
    '/products/saree-maroon-patola.jpg',
    '/products/saree-peach-organza.jpg',
    '/products/saree-black-gold.jpg'
];
const kurtiImages = [
    '/products/kurti-teal-cotton.jpg',
    '/products/kurti-maroon-anarkali.jpg',
    '/products/kurti-yellow-printed.jpg',
    '/products/kurti-navy-silk.jpg',
    '/products/kurti-white-chikankari.jpg',
    '/products/kurti-pink-palazzo-set.jpg'
];
const mensShirtImages = [
    '/products/shirt-blue-formal.jpg',
    '/products/shirt-white-linen.jpg',
    '/products/kurta-cream-ethnic.jpg'
];
const mensPantImages = [
    '/products/pants-navy-formal.jpg',
    '/products/pants-beige-chinos.jpg'
];
const kidsImages = [
    '/products/kids-boy-kurta.jpg',
    '/products/kids-girl-lehenga.jpg',
    '/products/kids-girl-dress.jpg'
];
const fabricImages = [
    '/products/fabric-silk-maroon.jpg',
    '/products/fabric-cotton-white.jpg',
    '/products/fabric-linen-beige.jpg',
    '/products/fabric-brocade-gold.jpg'
];

// Color options and Metadata
const sareeColors = ['Red', 'Blue', 'Pink', 'Green', 'Purple', 'Maroon', 'Peach', 'Black', 'Gold', 'Orange', 'Yellow', 'Teal', 'Magenta', 'Cream', 'Navy', 'Turquoise', 'Lavender', 'Coral', 'Beige', 'Wine'];
const fabricTypes = ['Silk', 'Cotton', 'Chiffon', 'Georgette', 'Organza', 'Linen', 'Banarasi', 'Kanchipuram', 'Patola', 'Chanderi', 'Tussar', 'Crepe', 'Net', 'Satin'];
const kurtiStyles = ['Anarkali', 'Straight', 'A-Line', 'Palazzo Set', 'Sharara Set', 'Floor Length', 'Short', 'Asymmetric', 'Layered', 'Jacket Style'];
const pantStyles = ['Formal', 'Casual', 'Slim Fit', 'Regular Fit', 'Chinos', 'Cargo', 'Joggers', 'Pleated', 'Tapered', 'Straight'];
const shirtStyles = ['Formal', 'Casual', 'Linen', 'Oxford', 'Mandarin Collar', 'Kurta', 'Polo', 'Printed', 'Striped', 'Checked'];

// Generators
const generateSarees = () => {
    const sarees = [];
    const styles = ['Kanchipuram', 'Banarasi', 'Patola', 'Chanderi', 'Tussar', 'Bandhani', 'Paithani', 'Pochampally', 'Maheshwari', 'Tant'];
    const occasions = ['Wedding', 'Party', 'Festive', 'Casual', 'Office', 'Bridal', 'Reception', 'Daily Wear'];

    for (let i = 0; i < 50; i++) {
        const color = sareeColors[i % sareeColors.length];
        const fabric = fabricTypes[i % fabricTypes.length];
        const style = styles[i % styles.length];
        const occasion = occasions[i % occasions.length];
        const image = sareeImages[i % sareeImages.length];
        const price = Math.floor(Math.random() * 20000) + 2999;
        const hasDiscount = Math.random() > 0.5;

        sarees.push({
            id: `saree-${i + 1}`,
            name: `${color} ${style} ${fabric} Saree`,
            price,
            originalPrice: hasDiscount ? Math.floor(price * 1.25) : undefined,
            category: 'sarees',
            fabric,
            description: `Elegant ${style.toLowerCase()} saree in beautiful ${color.toLowerCase()} ${fabric.toLowerCase()}. Perfect for ${occasion.toLowerCase()} occasions. Features intricate work and premium quality fabric.`,
            image,
            images: [image],
            sizes: ['Free Size'],
            colors: [color, 'Gold'],
            inStock: true,
            isNew: i < 10,
            isFeatured: i < 8,
            rating: Number((4 + Math.random()).toFixed(1)),
            reviews: Math.floor(Math.random() * 200) + 20,
            searchTags: ['saree', 'sari', fabric.toLowerCase(), color.toLowerCase(), style.toLowerCase(), occasion.toLowerCase(), 'indian', 'traditional', 'ethnic', 'women', 'ladies'],
        });
    }
    return sarees;
};

const generateKurtis = () => {
    const kurtis = [];
    const lengths = ['Short', 'Long', 'Midi', 'Floor Length', 'Knee Length'];
    const works = ['Embroidered', 'Printed', 'Block Print', 'Chikankari', 'Mirror Work', 'Gotta Patti', 'Zari Work', 'Threadwork', 'Sequin', 'Plain'];

    for (let i = 0; i < 50; i++) {
        const color = sareeColors[i % sareeColors.length];
        const fabric = ['Cotton', 'Silk', 'Georgette', 'Rayon', 'Linen', 'Chanderi'][i % 6];
        const style = kurtiStyles[i % kurtiStyles.length];
        const length = lengths[i % lengths.length];
        const work = works[i % works.length];
        const image = kurtiImages[i % kurtiImages.length];
        const price = Math.floor(Math.random() * 4000) + 999;
        const hasDiscount = Math.random() > 0.5;

        kurtis.push({
            id: `kurti-${i + 1}`,
            name: `${color} ${work} ${style} Kurti`,
            price,
            originalPrice: hasDiscount ? Math.floor(price * 1.3) : undefined,
            category: 'kurtis',
            fabric,
            description: `Beautiful ${length.toLowerCase()} ${style.toLowerCase()} kurti in ${color.toLowerCase()} with ${work.toLowerCase()}. Made with premium ${fabric.toLowerCase()} fabric. Perfect for casual and festive wear.`,
            image,
            images: [image],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: [color],
            inStock: true,
            isNew: i < 8,
            isFeatured: i < 6,
            rating: Number((4 + Math.random()).toFixed(1)),
            reviews: Math.floor(Math.random() * 150) + 30,
            searchTags: ['kurti', 'kurta', 'top', fabric.toLowerCase(), color.toLowerCase(), style.toLowerCase(), work.toLowerCase(), 'indian', 'ethnic', 'women', 'ladies', 'casual', 'festive'],
        });
    }
    return kurtis;
};

const generateMensShirts = () => {
    const shirts = [];
    const colors = ['Blue', 'White', 'Navy', 'Black', 'Grey', 'Pink', 'Lavender', 'Green', 'Beige', 'Cream', 'Maroon', 'Teal'];
    const patterns = ['Solid', 'Striped', 'Checked', 'Printed', 'Textured', 'Plaid', 'Micro Print'];

    for (let i = 0; i < 25; i++) {
        const color = colors[i % colors.length];
        const fabric = ['Cotton', 'Linen', 'Oxford Cotton', 'Poplin', 'Chambray'][i % 5];
        const style = shirtStyles[i % shirtStyles.length];
        const pattern = patterns[i % patterns.length];
        const image = mensShirtImages[i % mensShirtImages.length];
        const price = Math.floor(Math.random() * 2000) + 999;
        const hasDiscount = Math.random() > 0.5;

        shirts.push({
            id: `shirt-${i + 1}`,
            name: `${color} ${pattern} ${style} Shirt`,
            price,
            originalPrice: hasDiscount ? Math.floor(price * 1.25) : undefined,
            category: 'mens',
            fabric,
            description: `Premium ${fabric.toLowerCase()} ${style.toLowerCase()} shirt in ${color.toLowerCase()} with ${pattern.toLowerCase()} design. Perfect for office and casual occasions.`,
            image,
            images: [image],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: [color],
            inStock: true,
            isNew: i < 5,
            isFeatured: i < 4,
            rating: Number((4 + Math.random()).toFixed(1)),
            reviews: Math.floor(Math.random() * 100) + 20,
            searchTags: ['shirt', 'men', 'mens', fabric.toLowerCase(), color.toLowerCase(), style.toLowerCase(), pattern.toLowerCase(), 'formal', 'casual', 'office'],
        });
    }
    return shirts;
};

const generateMensPants = () => {
    const pants = [];
    const colors = ['Navy', 'Black', 'Grey', 'Beige', 'Brown', 'Khaki', 'Olive', 'Charcoal', 'Blue', 'Cream'];
    const fabrics = ['Cotton', 'Linen', 'Poly-Cotton', 'Denim', 'Twill', 'Corduroy'];

    for (let i = 0; i < 25; i++) {
        const color = colors[i % colors.length];
        const fabric = fabrics[i % fabrics.length];
        const style = pantStyles[i % pantStyles.length];
        const image = mensPantImages[i % mensPantImages.length];
        const price = Math.floor(Math.random() * 2000) + 999;
        const hasDiscount = Math.random() > 0.5;

        pants.push({
            id: `pant-${i + 1}`,
            name: `${color} ${style} ${fabric} Pants`,
            price,
            originalPrice: hasDiscount ? Math.floor(price * 1.2) : undefined,
            category: 'mens',
            fabric,
            description: `Comfortable ${style.toLowerCase()} pants in ${color.toLowerCase()} ${fabric.toLowerCase()}. Features modern fit and premium quality fabric.`,
            image,
            images: [image],
            sizes: ['28', '30', '32', '34', '36', '38', '40'],
            colors: [color],
            inStock: true,
            isNew: i < 4,
            isFeatured: i < 3,
            rating: Number((4 + Math.random()).toFixed(1)),
            reviews: Math.floor(Math.random() * 80) + 15,
            searchTags: ['pant', 'pants', 'trousers', 'men', 'mens', fabric.toLowerCase(), color.toLowerCase(), style.toLowerCase(), 'formal', 'casual', 'office', 'jeans', 'chinos'],
        });
    }
    return pants;
};

const generateKidsWear = () => {
    const kids = [];
    const boyStyles = ['Kurta Set', 'Sherwani', 'Ethnic Set', 'Kurta Pajama', 'Dhoti Set', 'Jacket Set'];
    const girlStyles = ['Lehenga', 'Anarkali', 'Salwar Set', 'Frock', 'Gown', 'Sharara Set'];
    const colors = ['Pink', 'Blue', 'Red', 'Yellow', 'Orange', 'Green', 'Purple', 'Maroon', 'Cream', 'Gold'];

    for (let i = 0; i < 50; i++) {
        const isBoy = i % 2 === 0;
        const color = colors[i % colors.length];
        const style = isBoy ? boyStyles[Math.floor(i / 2) % boyStyles.length] : girlStyles[Math.floor(i / 2) % girlStyles.length];
        const fabric = ['Cotton', 'Silk', 'Brocade'][i % 3];
        const image = kidsImages[i % kidsImages.length];
        const price = Math.floor(Math.random() * 2000) + 499;
        const hasDiscount = Math.random() > 0.5;
        const gender = isBoy ? 'Boy' : 'Girl';

        kids.push({
            id: `kids-${i + 1}`,
            name: `${gender}'s ${color} ${style}`,
            price,
            originalPrice: hasDiscount ? Math.floor(price * 1.25) : undefined,
            category: 'kids',
            fabric,
            description: `Adorable ${style.toLowerCase()} for ${gender.toLowerCase()}s in ${color.toLowerCase()} ${fabric.toLowerCase()}. Perfect for festivals and celebrations.`,
            image,
            images: [image],
            sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y'],
            colors: [color],
            inStock: true,
            isNew: i < 6,
            isFeatured: i < 4,
            rating: Number((4 + Math.random()).toFixed(1)),
            reviews: Math.floor(Math.random() * 60) + 10,
            searchTags: ['kids', 'kid', 'children', 'child', gender.toLowerCase(), 'boy', 'girl', style.toLowerCase(), fabric.toLowerCase(), color.toLowerCase(), 'ethnic', 'festive', 'party', 'kids wear'],
        });
    }
    return kids;
};

const generateFabrics = () => {
    const fabrics = [];
    const types = ['Pure Silk', 'Cotton', 'Linen', 'Brocade', 'Chanderi', 'Organza', 'Georgette', 'Chiffon', 'Velvet', 'Crepe'];
    const colors = ['Maroon', 'White', 'Beige', 'Gold', 'Navy', 'Red', 'Green', 'Black', 'Pink', 'Blue', 'Purple', 'Cream', 'Orange', 'Teal'];
    const uses = ['Saree', 'Kurta', 'Lehenga', 'Dress', 'Blouse', 'Suit', 'Multi-purpose'];

    for (let i = 0; i < 50; i++) {
        const type = types[i % types.length];
        const color = colors[i % colors.length];
        const use = uses[i % uses.length];
        const image = fabricImages[i % fabricImages.length];
        const price = Math.floor(Math.random() * 1500) + 199;
        const hasDiscount = Math.random() > 0.5;

        fabrics.push({
            id: `fabric-${i + 1}`,
            name: `${color} ${type} Fabric`,
            price,
            originalPrice: hasDiscount ? Math.floor(price * 1.2) : undefined,
            category: 'fabrics',
            fabric: type,
            description: `Premium ${type.toLowerCase()} fabric in beautiful ${color.toLowerCase()}. Ideal for ${use.toLowerCase()}. Price per meter. High quality, soft texture.`,
            image,
            images: [image],
            sizes: ['1m', '2m', '3m', '5m', '10m'],
            colors: [color],
            inStock: true,
            isNew: i < 5,
            isFeatured: i < 4,
            rating: Number((4 + Math.random()).toFixed(1)),
            reviews: Math.floor(Math.random() * 50) + 10,
            searchTags: ['fabric', 'cloth', 'material', type.toLowerCase(), color.toLowerCase(), use.toLowerCase(), 'textile', 'meter', 'dress material'],
        });
    }
    return fabrics;
};

const seedDB = async () => {
    try {
        const count = await Product.countDocuments();
        if (count > 0) {
            console.log('Database already has data. Skipping seed.');
            process.exit();
        }

        const products = [
            ...generateSarees(),
            ...generateKurtis(),
            ...generateMensShirts(),
            ...generateMensPants(),
            ...generateKidsWear(),
            ...generateFabrics(),
        ];

        await Product.insertMany(products);
        console.log('Database seeded with ' + products.length + ' products!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();

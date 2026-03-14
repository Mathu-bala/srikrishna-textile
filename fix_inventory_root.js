const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend/.env') });

const Product = require('./backend/models/Product');
const Inventory = require('./backend/models/Inventory');

async function fixInventory() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Found ${products.length} products`);

        let syncedCount = 0;
        let index = 0;

        for (const product of products) {
            const existing = await Inventory.findOne({ productId: product._id });
            const demoStockValue = (index < 20) ? 0 : (product.stock !== undefined ? product.stock : 50);

            if (!existing) {
                const inventoryItem = new Inventory({
                    productId: product._id,
                    productName: product.name,
                    sku: product.sku || product.id || "SKU-" + product._id,
                    variant: product.variant || "Standard",
                    stockLevel: demoStockValue,
                    price: product.price || 0
                });
                await inventoryItem.save();
                syncedCount++;
            } else {
                existing.stockLevel = demoStockValue;
                existing.price = product.price || existing.price;
                existing.productName = product.name;
                await existing.save();
                syncedCount++;
            }
            index++;
        }

        console.log(`Successfully synced ${syncedCount} inventory records.`);
        process.exit(0);
    } catch (error) {
        console.error('Error fixing inventory:', error);
        process.exit(1);
    }
}

fixInventory();

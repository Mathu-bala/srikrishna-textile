
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishna-textile');
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@srikrishna.com';
        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin user already exists');
            // Ensure isAdmin is true
            if (!userExists.isAdmin) {
                userExists.isAdmin = true;
                await userExists.save();
                console.log('Updated existing user to Admin');
            }
        } else {
            // Create admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const user = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: 'admin123', // userSchema pre-save will hash this
                isAdmin: true
            });
            console.log('Admin user created successfully');
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();

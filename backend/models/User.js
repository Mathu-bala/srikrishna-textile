const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    profilePhoto: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
    isBlocked: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now },
    orderCount: { type: Number, default: 0 },
    preferences: {
        themeColor: { type: String, default: 'purple' },
        mode: { type: String, default: 'dark', enum: ['dark', 'light'] }
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

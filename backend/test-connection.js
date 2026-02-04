require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri.replace(/:([^:@]+)@/, ':****@')); // Mask password

mongoose.connect(uri)
    .then(() => {
        console.log('Connection SUCCESS!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection FAILED:', err);
        process.exit(1);
    });

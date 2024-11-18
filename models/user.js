const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, minlength: 3 },
        password: { type: String, required: true, minlength: 6 },
        firstName: String,
        lastName: String,
        age: { type: Number, min: 0 },
        gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
        role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
        twoFactorAuth: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

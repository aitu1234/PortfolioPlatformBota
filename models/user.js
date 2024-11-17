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
        role: { type: String, default: 'editor' },
        twoFactorAuth: String,
    },
    { timestamps: true } // Добавляем createdAt и updatedAt
);

// Хеширование пароля перед сохранением
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Метод для проверки пароля
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

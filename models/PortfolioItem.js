const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    images: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);

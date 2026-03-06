const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Birthday Cakes', 'Wedding Cakes', 'Anniversary Cakes', 'Custom Cakes']
    },
    imageUrl: { type: String, required: true },
    stock: { type: Number, default: 10 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cake', cakeSchema);

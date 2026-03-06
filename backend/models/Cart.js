const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
        {
            cakeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true },
            imageUrl: { type: String },
        }
    ],
    totalPrice: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Cart', cartSchema);

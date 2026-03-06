const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            cakeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }
    ],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'UPI', 'CARD'], required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Preparing', 'Out for delivery', 'Delivered'],
        default: 'Pending'
    },
    eventType: { type: String, enum: ['Birthday', 'Anniversary', 'None'], default: 'None' },
    eventDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);

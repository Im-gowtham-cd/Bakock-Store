const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();
const nodemailer = require('nodemailer');

// @desc    Create new order
// @route   POST /api/orders
router.post('/', protect, async (req, res) => {
    const { items, totalPrice, paymentMethod, eventType, eventDate } = req.body;

    if (items && items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
        userId: req.user._id,
        items,
        totalPrice,
        paymentMethod,
        eventType,
        eventDate,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid', // Simulate payment
    });

    const createdOrder = await order.save();

    // Clear cart after order
    await Cart.findOneAndDelete({ userId: req.user._id });

    // Send Email Confirmation (Pseudo-code/Simulation)
    // console.log(`Email sent to ${req.user.email} for order ${createdOrder._id}`);

    res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
router.get('/', protect, admin, async (req, res) => {
    const orders = await Order.find({}).populate('userId', 'name email');
    res.json(orders);
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, admin, async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.orderStatus = req.body.orderStatus || order.orderStatus;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

module.exports = router;

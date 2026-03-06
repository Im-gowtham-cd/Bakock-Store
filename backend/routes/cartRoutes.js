const express = require('express');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
router.get('/', protect, async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) res.json(cart);
    else res.json({ items: [], totalPrice: 0 });
});

// @desc    Add item to cart
// @route   POST /api/cart
router.post('/', protect, async (req, res) => {
    const { cakeId, name, price, imageUrl, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
        const itemIndex = cart.items.findIndex((item) => item.cakeId.toString() === cakeId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ cakeId, name, price, imageUrl, quantity });
        }
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();
    } else {
        cart = await Cart.create({
            userId: req.user._id,
            items: [{ cakeId, name, price, imageUrl, quantity }],
            totalPrice: price * quantity,
        });
    }
    res.json(cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:cakeId
router.delete('/:cakeId', protect, async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
        cart.items = cart.items.filter((item) => item.cakeId.toString() !== req.params.cakeId);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
});

module.exports = router;

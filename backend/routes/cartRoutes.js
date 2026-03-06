const express = require('express');
const { Query, ID } = require('node-appwrite');
const { databases, DATABASE_ID, CART_COLLECTION_ID } = require('../config/appwrite');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
router.get('/', protect, async (req, res) => {
    try {
        // Find cart by userId
        const response = await databases.listDocuments(
            DATABASE_ID,
            CART_COLLECTION_ID,
            [Query.equal('userId', req.user._id)]
        );

        if (response.total > 0) {
            const cart = response.documents[0];
            res.json({
                ...cart,
                _id: cart.$id,
                items: JSON.parse(cart.items)
            });
        } else {
            res.json({ items: [], totalPrice: 0 });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add item to cart
// @route   POST /api/cart
router.post('/', protect, async (req, res) => {
    try {
        const { cakeId, name, price, imageUrl, quantity } = req.body;

        const response = await databases.listDocuments(
            DATABASE_ID,
            CART_COLLECTION_ID,
            [Query.equal('userId', req.user._id)]
        );

        let cart;
        let items = [];

        if (response.total > 0) {
            cart = response.documents[0];
            items = JSON.parse(cart.items);

            const itemIndex = items.findIndex((item) => item.cakeId === cakeId);
            if (itemIndex > -1) {
                items[itemIndex].quantity += quantity;
            } else {
                items.push({ cakeId, name, price, imageUrl, quantity });
            }

            const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

            const updatedCart = await databases.updateDocument(
                DATABASE_ID,
                CART_COLLECTION_ID,
                cart.$id,
                {
                    items: JSON.stringify(items),
                    totalPrice
                }
            );

            res.json({ ...updatedCart, _id: updatedCart.$id, items });
        } else {
            const totalPrice = price * quantity;
            items = [{ cakeId, name, price, imageUrl, quantity }];

            const newCart = await databases.createDocument(
                DATABASE_ID,
                CART_COLLECTION_ID,
                ID.unique(),
                {
                    userId: req.user._id,
                    items: JSON.stringify(items),
                    totalPrice
                }
            );

            res.json({ ...newCart, _id: newCart.$id, items });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:cakeId
router.delete('/:cakeId', protect, async (req, res) => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            CART_COLLECTION_ID,
            [Query.equal('userId', req.user._id)]
        );

        if (response.total > 0) {
            const cart = response.documents[0];
            let items = JSON.parse(cart.items);

            items = items.filter((item) => item.cakeId !== req.params.cakeId);
            const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

            const updatedCart = await databases.updateDocument(
                DATABASE_ID,
                CART_COLLECTION_ID,
                cart.$id,
                {
                    items: JSON.stringify(items),
                    totalPrice
                }
            );

            res.json({ ...updatedCart, _id: updatedCart.$id, items });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;


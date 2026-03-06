const express = require('express');
const { Query, ID } = require('node-appwrite');
const { databases, DATABASE_ID, ORDERS_COLLECTION_ID, CART_COLLECTION_ID, USERS_COLLECTION_ID } = require('../config/appwrite');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
router.post('/', protect, async (req, res) => {
    try {
        const { items, totalPrice, paymentMethod, eventType, eventDate } = req.body;

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = await databases.createDocument(
            DATABASE_ID,
            ORDERS_COLLECTION_ID,
            ID.unique(),
            {
                userId: req.user._id,
                items: JSON.stringify(items),
                totalPrice,
                paymentMethod,
                eventType,
                eventDate,
                paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
                orderStatus: 'Pending',
                createdAt: new Date().toISOString()
            }
        );

        // Clear cart after order
        const cartResponse = await databases.listDocuments(
            DATABASE_ID,
            CART_COLLECTION_ID,
            [Query.equal('userId', req.user._id)]
        );

        if (cartResponse.total > 0) {
            await databases.deleteDocument(DATABASE_ID, CART_COLLECTION_ID, cartResponse.documents[0].$id);
        }

        res.status(201).json({ ...order, _id: order.$id, items });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            ORDERS_COLLECTION_ID,
            [Query.equal('userId', req.user._id)]
        );
        const orders = response.documents.map(doc => ({
            ...doc,
            _id: doc.$id,
            items: JSON.parse(doc.items)
        }));
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
router.get('/', protect, admin, async (req, res) => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID);

        // Manual population of userId (name, email)
        const ordersWithUser = await Promise.all(response.documents.map(async (order) => {
            let userData = { name: 'Unknown', email: 'Unknown' };
            try {
                const userDoc = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, order.userId);
                userData = { name: userDoc.name, email: userDoc.email };
            } catch (err) {
                console.error(`User ${order.userId} not found for order ${order.$id}`);
            }
            return {
                ...order,
                _id: order.$id,
                items: JSON.parse(order.items),
                userId: userData
            };
        }));

        res.json(ordersWithUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const order = await databases.updateDocument(
            DATABASE_ID,
            ORDERS_COLLECTION_ID,
            req.params.id,
            {
                orderStatus: req.body.orderStatus
            }
        );
        res.json({ ...order, _id: order.$id });
    } catch (error) {
        res.status(404).json({ message: 'Order not found' });
    }
});

module.exports = router;


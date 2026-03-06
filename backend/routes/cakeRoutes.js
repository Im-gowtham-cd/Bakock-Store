const express = require('express');
const { ID } = require('node-appwrite');
const { databases, DATABASE_ID, CAKES_COLLECTION_ID } = require('../config/appwrite');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// @desc    Fetch all cakes
// @route   GET /api/cakes
router.get('/', async (req, res) => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, CAKES_COLLECTION_ID);
        // Map Appwrite response to match previous Mongoose output if needed
        const cakes = response.documents.map(doc => ({
            ...doc,
            _id: doc.$id
        }));
        res.json(cakes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Fetch single cake
// @route   GET /api/cakes/:id
router.get('/:id', async (req, res) => {
    try {
        const cake = await databases.getDocument(DATABASE_ID, CAKES_COLLECTION_ID, req.params.id);
        res.json({ ...cake, _id: cake.$id });
    } catch (error) {
        res.status(404).json({ message: 'Cake not found' });
    }
});

// @desc    Create a cake (Admin)
// @route   POST /api/cakes
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '/uploads/default-cake.jpg';

        const cake = await databases.createDocument(
            DATABASE_ID,
            CAKES_COLLECTION_ID,
            ID.unique(),
            {
                name,
                description,
                price: Number(price),
                category,
                stock: Number(stock),
                imageUrl,
                createdAt: new Date().toISOString()
            }
        );
        res.status(201).json({ ...cake, _id: cake.$id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a cake (Admin)
// @route   DELETE /api/cakes/:id
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await databases.deleteDocument(DATABASE_ID, CAKES_COLLECTION_ID, req.params.id);
        res.json({ message: 'Cake removed' });
    } catch (error) {
        res.status(404).json({ message: 'Cake not found' });
    }
});

module.exports = router;


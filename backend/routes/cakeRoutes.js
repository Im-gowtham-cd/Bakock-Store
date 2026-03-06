const express = require('express');
const Cake = require('../models/Cake');
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
    const cakes = await Cake.find({});
    res.json(cakes);
});

// @desc    Fetch single cake
// @route   GET /api/cakes/:id
router.get('/:id', async (req, res) => {
    const cake = await Cake.findById(req.params.id);
    if (cake) res.json(cake);
    else res.status(404).json({ message: 'Cake not found' });
});

// @desc    Create a cake (Admin)
// @route   POST /api/cakes
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '/uploads/default-cake.jpg';

    const cake = new Cake({ name, description, price, category, stock, imageUrl });
    const createdCake = await cake.save();
    res.status(201).json(createdCake);
});

// @desc    Delete a cake (Admin)
// @route   DELETE /api/cakes/:id
router.delete('/:id', protect, admin, async (req, res) => {
    const cake = await Cake.findById(req.params.id);
    if (cake) {
        await cake.deleteOne();
        res.json({ message: 'Cake removed' });
    } else {
        res.status(404).json({ message: 'Cake not found' });
    }
});

module.exports = router;

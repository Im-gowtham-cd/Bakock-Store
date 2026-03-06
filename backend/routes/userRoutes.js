const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Query, ID } = require('node-appwrite');
const { databases, DATABASE_ID, USERS_COLLECTION_ID } = require('../config/appwrite');
const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/users/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUsers = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal('email', email)]
        );

        if (existingUsers.total > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password (mimicking Mongoose pre-save hook)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user document
        const user = await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            ID.unique(),
            {
                name,
                email,
                password: hashedPassword,
                role: 'user',
                createdAt: new Date().toISOString()
            }
        );

        res.status(201).json({
            _id: user.$id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.$id),
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(400).json({ message: error.message || 'Invalid user data' });
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const users = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal('email', email)]
        );

        if (users.total === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users.documents[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user.$id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.$id),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("API Error (GET Users):", error.message);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/users/:id - Get a specific user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error("API Error (GET User By ID):", error.message);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Please provide name and email' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = new User({ name, email });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error("API Error (POST User):", error.message);
        res.status(400).json({ message: error.message });
    }
});

// For demo purposes - create or get demo user
router.post('/demo', async (req, res) => {
    try {
        let user = await User.findOne({ email: 'demo@student.edu' });

        if (!user) {
            user = new User({
                name: 'Demo Student',
                email: 'demo@student.edu'
            });
            await user.save();
        }

        res.json(user);
    } catch (error) {
        console.error("API Error (POST Demo User):", error.message);
        res.status(400).json({ message: error.message });
    }
});

export default router;

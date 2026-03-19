import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// GET /api/transactions - Fetch all transactions for a user
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const transactions = await Transaction.find({ userId })
            .sort({ date: -1 })
            .limit(100);

        res.json(transactions);
    } catch (error) {
        console.error("API Error (GET Transactions):", error.message);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/transactions - Add a new transaction
router.post('/', async (req, res) => {
    try {
        const { userId, amount, type, category, description, date } = req.body;

        if (!userId || !amount || !type || !category) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const transaction = new Transaction({
            userId,
            amount,
            type,
            category,
            description,
            date: date || Date.now()
        });

        const savedTransaction = await transaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        console.error("API Error (POST Transaction):", error.message);
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/transactions/:id - Edit a specific transaction
router.put('/:id', async (req, res) => {
    try {
        const { amount, type, category, description, date } = req.body;

        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (amount) transaction.amount = amount;
        if (type) transaction.type = type;
        if (category) transaction.category = category;
        if (description !== undefined) transaction.description = description;
        if (date) transaction.date = date;

        const updatedTransaction = await transaction.save();
        res.json(updatedTransaction);
    } catch (error) {
        console.error("API Error (PUT Transaction):", error.message);
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/transactions/:id - Delete a specific transaction
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        await transaction.deleteOne();
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error("API Error (DELETE Transaction):", error.message);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/transactions/summary - Return aggregated data
router.get('/summary', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // Total aggregation
        const totalAggregation = await Transaction.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]);

        let totalIncome = 0;
        let totalExpenses = 0;
        totalAggregation.forEach(item => {
            if (item._id === 'income') totalIncome = item.total;
            else if (item._id === 'expense') totalExpenses = item.total;
        });

        // Monthly aggregation
        const monthlyAggregation = await Transaction.aggregate([
            {
                $match: {
                    userId: userId,
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]);

        let monthlyIncome = 0;
        let monthlyExpenses = 0;
        monthlyAggregation.forEach(item => {
            if (item._id === 'income') monthlyIncome = item.total;
            else if (item._id === 'expense') monthlyExpenses = item.total;
        });

        res.json({
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            monthlyIncome,
            monthlyExpenses
        });
    } catch (error) {
        console.error("API Error (GET Summary):", error.message);
        res.status(500).json({ message: error.message });
    }
});

export default router;

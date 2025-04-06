import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Expense from '../models/expense.models.js';

const router = express.Router();

// Create Expense
router.post('/', verifyToken, async (req, res) => {
    const { amount, category, currency, date, description } = req.body;
    const expense = new Expense({
        user: req.user._id,
        amount,
        category,
        currency,
        date,
        description
    });
    await expense.save();
    res.status(201).json(expense);
});

// Get Expenses (User: own, Admin: all)
router.get('/', verifyToken, async (req, res) => {
    const expenses = req.user.role === 'admin'
        ? await Expense.find().populate('user', 'name')
        : await Expense.find({ user: req.user._id });

    res.json(expenses);
});

// Update
router.put('/:id', verifyToken, async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Not found' });

    if (req.user.role !== 'admin' && expense.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: 'Unauthorized' });
    }

    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// Delete
router.delete('/:id', verifyToken, async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Not found' });

    if (req.user.role !== 'admin' && expense.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: 'Unauthorized' });
    }

    await expense.deleteOne();
    res.json({ msg: 'Deleted' });
});

export default router;

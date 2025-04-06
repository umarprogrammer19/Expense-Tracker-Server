import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: Number,
    category: String,
    currency: {
        type: String,
        default: 'USD'
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: String
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;

import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount'],
        min: [0, 'Amount cannot be negative']
    },
    type: {
        type: String,
        required: [true, 'Please specify transaction type'],
        enum: ['income', 'expense'],
        lowercase: true
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
        trim: true
        // Removed strict enum to prevent validation mismatches with frontend
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters'],
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

transactionSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Transaction', transactionSchema);

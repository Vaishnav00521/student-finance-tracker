import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import AnimatedModal from './animations/Modal';
import { cn } from '../utils/cn';

const CATEGORIES = {
    income: ['Allowance', 'Part-time Job', 'Scholarship', 'Gift', 'Other'],
    expense: ['Food', 'Rent', 'Education', 'Entertainment', 'Transportation', 'Shopping', 'Health', 'Other'],
};

/**
 * AddTransactionModal - Animated modal form for adding/editing transactions
 */
export default function AddTransactionModal({
    isOpen,
    onClose,
    userId,
    onSuccess,
    editingTransaction
}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    // Update form when editing transaction changes
    useEffect(() => {
        if (editingTransaction) {
            setFormData({
                type: editingTransaction.type,
                amount: editingTransaction.amount.toString(),
                category: editingTransaction.category,
                description: editingTransaction.description || '',
                date: new Date(editingTransaction.date).toISOString().split('T')[0],
            });
        }
    }, [editingTransaction]);

    // Update category when type changes
    useEffect(() => {
        if (!CATEGORIES[formData.type].includes(formData.category)) {
            setFormData(prev => ({ ...prev, category: CATEGORIES[formData.type][0] }));
        }
    }, [formData.type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.amount || parseFloat(formData.amount) <= 0) return;

        setLoading(true);
        try {
            const payload = {
                userId,
                type: formData.type,
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description,
                date: new Date(formData.date),
            };

            await onSuccess(payload, editingTransaction?._id);

            // Reset form
            setFormData({
                type: 'expense',
                amount: '',
                category: 'Food',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });

            onClose();
        } catch (error) {
            console.error('Error saving transaction:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={onClose}
            title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Transaction Type Toggle */}
                <motion.div
                    className="flex rounded-2xl bg-slate-100 p-1.5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {['expense', 'income'].map((type, index) => (
                        <motion.button
                            key={type}
                            type="button"
                            onClick={() => handleChange('type', type)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                'flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200',
                                formData.type === type
                                    ? type === 'expense'
                                        ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg'
                                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                                    : 'text-slate-500 hover:text-slate-700'
                            )}
                        >
                            {type === 'expense' ? '💸 Expense' : '💰 Income'}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Amount Input */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Amount (₹)
                    </label>
                    <motion.input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => handleChange('amount', e.target.value)}
                        whileFocus={{ scale: 1.02 }}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-lg font-semibold"
                        required
                    />
                </motion.div>

                {/* Category Select */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Category
                    </label>
                    <motion.select
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        whileFocus={{ scale: 1.02 }}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                    >
                        {CATEGORIES[formData.type].map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </motion.select>
                </motion.div>

                {/* Description Input */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Description (optional)
                    </label>
                    <motion.input
                        type="text"
                        placeholder="Add a note..."
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        whileFocus={{ scale: 1.02 }}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                    />
                </motion.div>

                {/* Date Input */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                        Date
                    </label>
                    <motion.input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        whileFocus={{ scale: 1.02 }}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all"
                    />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="pt-2"
                >
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className={cn(
                            'w-full py-4 rounded-2xl font-bold text-white transition-all duration-200',
                            'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700',
                            'shadow-lg shadow-indigo-200 hover:shadow-xl',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                    >
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="flex items-center justify-center"
                            >
                                <Loader2 className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <Plus className="w-5 h-5" />
                                {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                            </span>
                        )}
                    </motion.button>
                </motion.div>
            </form>
        </AnimatedModal>
    );
}

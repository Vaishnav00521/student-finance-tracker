import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

const CATEGORIES = {
    income: ['Allowance', 'Part-time Job', 'Scholarship', 'Gift', 'Other'],
    expense: ['Food', 'Rent', 'Education', 'Entertainment', 'Transportation', 'Shopping', 'Health', 'Other'],
};

/**
 * Transaction Form Component
 * Form to add or edit transactions
 */
export default function TransactionForm({ userId, onSuccess, editingTransaction, onCancel }) {
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

            if (editingTransaction) {
                await onSuccess(payload, editingTransaction._id);
            } else {
                await onSuccess(payload);
            }

            // Reset form
            setFormData({
                type: 'expense',
                amount: '',
                category: 'Food',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
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
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Transaction Type Toggle */}
                <div className="flex rounded-xl bg-slate-100 p-1">
                    {['expense', 'income'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => handleChange('type', type)}
                            className={cn(
                                'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200',
                                formData.type === type
                                    ? type === 'expense'
                                        ? 'bg-rose-500 text-white shadow-md'
                                        : 'bg-emerald-500 text-white shadow-md'
                                    : 'text-slate-600 hover:text-slate-800'
                            )}
                        >
                            {type === 'expense' ? 'Expense' : 'Income'}
                        </button>
                    ))}
                </div>

                {/* Amount Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">
                        Amount (₹)
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => handleChange('amount', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        required
                    />
                </div>

                {/* Category Select */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">
                        Category
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    >
                        {CATEGORIES[formData.type].map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">
                        Description (optional)
                    </label>
                    <input
                        type="text"
                        placeholder="Add a note..."
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                </div>

                {/* Date Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">
                        Date
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                    {editingTransaction && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            'flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200',
                            'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed',
                            'shadow-lg shadow-indigo-200 hover:shadow-xl'
                        )}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : editingTransaction ? (
                            'Update Transaction'
                        ) : (
                            'Add Transaction'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, categoryColors } from '../utils/cn';

/**
 * TransactionList - Animated list with add/remove animations
 */
export default function TransactionList({ transactions, onEdit, onDelete, loading }) {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = (id) => {
        setDeletingId(id);
        // Allow animation to play before actual delete
        setTimeout(() => {
            onDelete(id);
            setDeletingId(null);
        }, 300);
    };

    if (loading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100/50">
                    <div className="h-7 w-48 bg-slate-100 rounded-lg animate-pulse" />
                </div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-100 rounded w-32 animate-pulse" />
                                <div className="h-3 bg-slate-100 rounded w-24 animate-pulse" />
                            </div>
                            <div className="h-5 bg-slate-100 rounded w-20 animate-pulse" />
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/50 overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100/50">
                    <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
                </div>
                <div className="p-16 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-4"
                    >
                        <ArrowUpRight className="w-10 h-10 text-indigo-400" />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-600 font-semibold text-lg"
                    >
                        No transactions yet
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-400 text-sm mt-1"
                    >
                        Add your first transaction to get started
                    </motion.p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/50 overflow-hidden"
        >
            <div className="p-6 border-b border-slate-100/50">
                <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
            </div>

            <div className="divide-y divide-slate-100/50">
                <AnimatePresence mode="popLayout">
                    {transactions.map((transaction, index) => (
                        <motion.div
                            key={transaction._id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: { delay: index * 0.05 }
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                                transition: { duration: 0.2 }
                            }}
                            whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                            className="p-4 sm:p-5 cursor-pointer"
                        >
                            <div className="flex items-center justify-between gap-4">
                                {/* Category Icon & Details */}
                                <motion.div
                                    className="flex items-center gap-4 flex-1 min-w-0"
                                    whileHover={{ x: 4 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <motion.div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                        style={{
                                            backgroundColor: deletingId === transaction._id
                                                ? '#fee2e2'
                                                : `${categoryColors[transaction.category]}15`
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {transaction.type === 'income' ? (
                                            <ArrowUpRight
                                                className="w-6 h-6"
                                                style={{ color: categoryColors[transaction.category] }}
                                            />
                                        ) : (
                                            <ArrowDownRight
                                                className="w-6 h-6"
                                                style={{ color: categoryColors[transaction.category] }}
                                            />
                                        )}
                                    </motion.div>

                                    <div className="min-w-0 flex-1">
                                        <motion.p
                                            className="font-bold text-slate-800 truncate"
                                            whileHover={{ color: '#4f46e5' }}
                                        >
                                            {transaction.category}
                                        </motion.p>
                                        <motion.p
                                            className="text-sm text-slate-500 truncate"
                                        >
                                            {transaction.description || format(new Date(transaction.date), 'MMM d, yyyy')}
                                        </motion.p>
                                    </div>
                                </motion.div>

                                {/* Amount & Actions */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <motion.p
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.05 + 0.2, type: 'spring' }}
                                        className={`font-bold text-lg ${transaction.type === 'income'
                                                ? 'text-emerald-600'
                                                : 'text-slate-800'
                                            }`}
                                    >
                                        {transaction.type === 'income' ? '+' : '-'}
                                        {formatCurrency(transaction.amount)}
                                    </motion.p>

                                    <motion.div
                                        className="flex items-center gap-1"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 + 0.3 }}
                                    >
                                        <motion.button
                                            onClick={() => onEdit(transaction)}
                                            whileHover={{ scale: 1.15, backgroundColor: '#e0e7ff' }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2.5 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDelete(transaction._id)}
                                            disabled={deletingId === transaction._id}
                                            whileHover={{ scale: 1.15, backgroundColor: '#fee2e2' }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl transition-colors disabled:opacity-50"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

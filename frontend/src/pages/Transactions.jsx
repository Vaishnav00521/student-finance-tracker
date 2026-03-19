import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Edit,
    Trash2,
    DollarSign,
    ShoppingBag,
    Home,
    BookOpen,
    Music,
    Car,
    CreditCard,
    Zap,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Receipt
} from 'lucide-react';
import { useApp } from '../components/layout/MainLayout';
import { format } from 'date-fns';

// Category icons mapping
const categoryIcons = {
    'Food': ShoppingBag,
    'Rent': Home,
    'Education': BookOpen,
    'Entertainment': Music,
    'Transport': Car,
    'Shopping': CreditCard,
    'Utilities': Zap,
    'Allowance': DollarSign,
    'Part-time Job': DollarSign,
    'Scholarship': DollarSign,
    'Gift': DollarSign,
    'Other': MoreHorizontal
};

const ITEMS_PER_PAGE = 10;

export default function Transactions() {
    const { transactions, deleteTransaction, openEditModal, isLoading } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set(transactions.map(t => t.category));
        return ['all', ...Array.from(cats)];
    }, [transactions]);

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'all' || t.type === typeFilter;
            const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
            return matchesSearch && matchesType && matchesCategory;
        });
    }, [transactions, searchTerm, typeFilter, categoryFilter]);

    // Paginate
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header & Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-7"
            >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="font-display text-4xl font-bold text-white">All Transactions</h2>
                        <p className="text-slate-400 text-lg mt-1">Manage and track all your transactions</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-12 pr-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 w-full lg:w-72 text-base"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={typeFilter}
                            onChange={(e) => {
                                setTypeFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-5 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500 text-base"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>

                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-5 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500 text-base"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Transactions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl overflow-hidden"
            >
                {paginatedTransactions.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-800/50">
                                        <th className="text-left py-5 px-6 text-slate-400 font-medium text-lg">Date</th>
                                        <th className="text-left py-5 px-6 text-slate-400 font-medium text-lg">Description</th>
                                        <th className="text-left py-5 px-6 text-slate-400 font-medium text-lg">Category</th>
                                        <th className="text-left py-5 px-6 text-slate-400 font-medium text-lg">Type</th>
                                        <th className="text-right py-5 px-6 text-slate-400 font-medium text-lg">Amount</th>
                                        <th className="text-right py-5 px-6 text-slate-400 font-medium text-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence mode="popLayout">
                                        {paginatedTransactions.map((transaction, index) => {
                                            const Icon = categoryIcons[transaction.category] || MoreHorizontal;
                                            return (
                                                <motion.tr
                                                    key={transaction._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                                >
                                                    <td className="py-5 px-6">
                                                        <span className="text-slate-300 text-base">
                                                            {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <span className="text-white text-base font-medium">{transaction.description || '-'}</span>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2.5 rounded-xl ${transaction.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                                                                }`}>
                                                                <Icon className={`w-5 h-5 ${transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                                                                    }`} />
                                                            </div>
                                                            <span className="text-slate-300 text-base">{transaction.category}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <span className={`px-4 py-2 rounded-lg text-base font-medium capitalize ${transaction.type === 'income'
                                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                                : 'bg-red-500/10 text-red-500'
                                                            }`}>
                                                            {transaction.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-6 text-right">
                                                        <span className={`font-display text-2xl font-bold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-500'
                                                            }`}>
                                                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <motion.button
                                                                onClick={() => openEditModal(transaction)}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-5 h-5" />
                                                            </motion.button>
                                                            <motion.button
                                                                onClick={() => deleteTransaction(transaction._id)}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="p-2.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between p-6 border-t border-slate-800">
                                <p className="text-slate-400 text-base">
                                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} transactions
                                </p>
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-3 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </motion.button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <motion.button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`w-10 h-10 rounded-lg font-display font-medium text-base transition-all ${currentPage === page
                                                    ? 'bg-red-600 text-white shadow-glow'
                                                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                                }`}
                                        >
                                            {page}
                                        </motion.button>
                                    ))}

                                    <motion.button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-3 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-20 text-center">
                        <Receipt className="w-20 h-20 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-xl">No transactions found</p>
                        <p className="text-slate-500 text-base mt-2">Try adjusting your filters or add a new transaction</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

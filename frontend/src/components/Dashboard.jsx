import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import {
    Menu, Plus, Download, Wallet, TrendingUp, TrendingDown,
    Home, Receipt, PieChart, Settings, Moon, Sun, Trash2, Edit
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/cn';
import { exportToCSV } from '../utils/exportCSV';
import {
    getOrCreateDemoUser,
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary,
} from '../services/api';

// Animation variants
const pageVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
};

// Categories with red theme colors
const CATEGORIES = {
    income: ['Allowance', 'Part-time Job', 'Scholarship', 'Gift', 'Other'],
    expense: ['Food', 'Rent', 'Education', 'Entertainment', 'Transportation', 'Shopping', 'Health', 'Other'],
};

const COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#991b1b', '#7f1d1d', '#b91c1c', '#c2410c'];

/**
 * Main Dashboard Component - Red & Black Theme
 */
export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userData = await getOrCreateDemoUser();
                setUser(userData);

                const [transactionsData, summaryData] = await Promise.all([
                    getTransactions(userData._id),
                    getSummary(userData._id),
                ]);

                setTransactions(transactionsData);
                setSummary(summaryData);
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSaveTransaction = async (transactionData, transactionId = null) => {
        try {
            if (transactionId) {
                await updateTransaction(transactionId, transactionData);
                toast.success('Transaction updated!');
            } else {
                await createTransaction(transactionData);
                toast.success('Transaction added!');
            }

            const [transactionsData, summaryData] = await Promise.all([
                getTransactions(user._id),
                getSummary(user._id),
            ]);

            setTransactions(transactionsData);
            setSummary(summaryData);
            setEditingTransaction(null);
        } catch (error) {
            toast.error('Failed to save transaction');
            throw error;
        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        try {
            await deleteTransaction(transactionId);
            toast.success('Transaction deleted!');

            const [transactionsData, summaryData] = await Promise.all([
                getTransactions(user._id),
                getSummary(user._id),
            ]);

            setTransactions(transactionsData);
            setSummary(summaryData);
        } catch (error) {
            toast.error('Failed to delete transaction');
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleExport = () => {
        const success = exportToCSV(transactions);
        if (success) {
            toast.success('CSV exported successfully!');
        } else {
            toast.error('No transactions to export');
        }
    };

    // Chart data
    const chartData = summary?.expensesByCategory?.map((item, index) => ({
        name: item._id,
        value: item.total,
        color: COLORS[index % COLORS.length]
    })) || [];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Toast */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1a1a1a',
                        border: '1px solid #dc2626',
                        borderRadius: '12px',
                        color: '#fff',
                    },
                    success: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
            />

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ x: sidebarOpen ? 0 : -280 }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-[#111111] border-r border-[#222222] z-50 lg:translate-x-0 lg:static"
            >
                <div className="p-6 border-b border-[#222222]">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                            <Wallet className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-bold text-xl">ExpenseTrack</span>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    {[
                        { id: 'dashboard', icon: Home, label: 'Dashboard' },
                        { id: 'transactions', icon: Receipt, label: 'Transactions' },
                        { id: 'analytics', icon: PieChart, label: 'Analytics' },
                        { id: 'settings', icon: Settings, label: 'Settings' },
                    ].map((item) => (
                        <motion.button
                            key={item.id}
                            onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${currentPage === item.id
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </motion.button>
                    ))}
                </nav>
            </motion.aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/70 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="lg:ml-72">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#222222]">
                    <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 text-gray-400 hover:text-white"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {currentPage === 'dashboard' && 'Dashboard'}
                                    {currentPage === 'transactions' && 'Transactions'}
                                    {currentPage === 'analytics' && 'Analytics'}
                                    {currentPage === 'settings' && 'Settings'}
                                </h1>
                                {user && (
                                    <p className="text-gray-500 text-sm">Welcome back, {user.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={handleExport}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border border-[#333333] rounded-xl text-gray-300 hover:text-white hover:border-red-600 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                            </motion.button>

                            <motion.button
                                onClick={() => setIsDark(!isDark)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2.5 bg-[#1a1a1a] border border-[#333333] rounded-xl text-gray-300 hover:text-white hover:border-red-600"
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </motion.button>

                            <motion.button
                                onClick={() => setIsModalOpen(true)}
                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)' }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-semibold shadow-lg"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="hidden sm:inline">Add</span>
                            </motion.button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-4 lg:p-8">
                    <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        className="space-y-6"
                    >
                        {/* Stats Cards */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard
                                title="Total Balance"
                                amount={summary?.balance || 0}
                                icon={Wallet}
                                color="red"
                            />
                            <StatCard
                                title="Monthly Income"
                                amount={summary?.monthlyIncome || 0}
                                icon={TrendingUp}
                                color="green"
                            />
                            <StatCard
                                title="Monthly Expenses"
                                amount={summary?.monthlyExpenses || 0}
                                icon={TrendingDown}
                                color="orange"
                            />
                        </motion.div>

                        {/* Chart & Form Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Chart */}
                            <motion.div variants={itemVariants} className="bg-[#111111] rounded-2xl p-6 border border-[#222222]">
                                <h2 className="text-xl font-bold mb-4">Expenses by Category</h2>
                                {chartData.length > 0 ? (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RePieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={index} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        background: '#1a1a1a',
                                                        border: '1px solid #333',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            </RePieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-gray-500">
                                        No expenses yet
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                                    {chartData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-lg">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-sm text-gray-300">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Quick Add Form */}
                            <motion.div variants={itemVariants} className="bg-[#111111] rounded-2xl p-6 border border-[#222222]">
                                <h2 className="text-xl font-bold mb-4">Quick Add</h2>
                                <QuickAddForm userId={user?._id} onSuccess={handleSaveTransaction} />
                            </motion.div>
                        </div>

                        {/* Budget Progress */}
                        <motion.div variants={itemVariants} className="bg-[#111111] rounded-2xl p-6 border border-[#222222]">
                            <h2 className="text-xl font-bold mb-4">Monthly Budget</h2>
                            <BudgetProgress expenses={summary?.monthlyExpenses || 0} limit={5000} />
                        </motion.div>

                        {/* Transactions */}
                        <motion.div variants={itemVariants}>
                            <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                            <TransactionsList
                                transactions={transactions}
                                onEdit={handleEdit}
                                onDelete={handleDeleteTransaction}
                                loading={loading}
                            />
                        </motion.div>
                    </motion.div>
                </main>
            </div>

            {/* Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
                userId={user?._id}
                onSuccess={handleSaveTransaction}
                editingTransaction={editingTransaction}
            />
        </div>
    );
}

/**
 * Stat Card Component
 */
function StatCard({ title, amount, icon: Icon, color }) {
    const colorClasses = {
        red: 'from-red-600 to-red-700',
        green: 'from-emerald-600 to-emerald-700',
        orange: 'from-orange-600 to-orange-700',
    };

    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(220, 38, 38, 0.2)' }}
            className="bg-[#111111] rounded-2xl p-5 border border-[#222222]"
        >
            <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">{title}</p>
            <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
        </motion.div>
    );
}

/**
 * Quick Add Form
 */
function QuickAddForm({ userId, onSuccess }) {
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: 'Food',
        description: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.amount || !userId) return;

        try {
            await onSuccess({
                userId,
                type: formData.type,
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description,
                date: new Date(),
            });
            setFormData({ type: 'expense', amount: '', category: 'Food', description: '' });
        } catch (error) { }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
                {['expense', 'income'].map(type => (
                    <motion.button
                        key={type}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, type }))}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${formData.type === type
                                ? type === 'expense'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-emerald-600 text-white'
                                : 'bg-[#1a1a1a] text-gray-400 border border-[#333333]'
                            }`}
                    >
                        {type === 'expense' ? 'Expense' : 'Income'}
                    </motion.button>
                ))}
            </div>

            <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-xl focus:border-red-600 focus:outline-none text-white"
                required
            />

            <select
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-xl focus:border-red-600 focus:outline-none text-white"
            >
                {CATEGORIES[formData.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-xl focus:border-red-600 focus:outline-none text-white"
            />

            <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-semibold"
            >
                Add Transaction
            </motion.button>
        </form>
    );
}

/**
 * Budget Progress Bar
 */
function BudgetProgress({ expenses, limit }) {
    const percentage = Math.min((expenses / limit) * 100, 100);
    const getColor = () => {
        if (percentage < 75) return 'bg-emerald-500';
        if (percentage < 90) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div>
            <div className="flex justify-between mb-2">
                <span className="text-gray-400">₹{expenses.toLocaleString()}</span>
                <span className="text-gray-400">₹{limit.toLocaleString()}</span>
            </div>
            <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${getColor()} rounded-full`}
                />
            </div>
            <p className="text-right mt-2 text-gray-500 text-sm">
                {percentage.toFixed(0)}% used
            </p>
        </div>
    );
}

/**
 * Transactions List
 */
function TransactionsList({ transactions, onEdit, onDelete, loading }) {
    if (loading) {
        return (
            <div className="bg-[#111111] rounded-2xl border border-[#222222] overflow-hidden">
                <div className="p-6 space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 bg-[#222222] rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[#222222] rounded w-32" />
                                <div className="h-3 bg-[#222222] rounded w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!transactions.length) {
        return (
            <div className="bg-[#111111] rounded-2xl border border-[#222222] p-12 text-center">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500">No transactions yet</p>
            </div>
        );
    }

    return (
        <div className="bg-[#111111] rounded-2xl border border-[#222222] overflow-hidden">
            <div className="divide-y divide-[#222222]">
                <AnimatePresence>
                    {transactions.map((t, index) => (
                        <motion.div
                            key={t._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-900/50 text-emerald-500' : 'bg-red-900/50 text-red-500'
                                    }`}>
                                    {t.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-medium">{t.category}</p>
                                    <p className="text-sm text-gray-500">{t.description || 'No description'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-white'
                                    }`}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                </p>
                                <div className="flex gap-1">
                                    <motion.button
                                        onClick={() => onEdit(t)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 text-gray-500 hover:text-red-500"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => onDelete(t._id)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 text-gray-500 hover:text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

/**
 * Transaction Modal
 */
function TransactionModal({ isOpen, onClose, userId, onSuccess, editingTransaction }) {
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSuccess({
                userId,
                type: formData.type,
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description,
                date: new Date(formData.date),
            }, editingTransaction?._id);
            onClose();
        } catch (error) { }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-[#111111] rounded-2xl border border-[#222222] p-6"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">
                    {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                        {['expense', 'income'].map(type => (
                            <motion.button
                                key={type}
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, type }))}
                                whileTap={{ scale: 0.95 }}
                                className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${formData.type === type
                                        ? type === 'expense' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                                        : 'bg-[#1a1a1a] text-gray-400 border border-[#333333]'
                                    }`}
                            >
                                {type === 'expense' ? 'Expense' : 'Income'}
                            </motion.button>
                        ))}
                    </div>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-xl focus:border-red-600 focus:outline-none text-white"
                        required
                    />
                    <select
                        value={formData.category}
                        onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-xl focus:border-red-600 focus:outline-none text-white"
                    >
                        {CATEGORIES[formData.type].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Description"
                        value={formData.description}
                        onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-xl focus:border-red-600 focus:outline-none text-white"
                    />
                    <input
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-xl focus:border-red-600 focus:outline-none text-white"
                    />
                    <div className="flex gap-3 pt-2">
                        <motion.button
                            type="button"
                            onClick={onClose}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-3 bg-[#1a1a1a] border border-[#333333] rounded-xl text-gray-400"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-semibold"
                        >
                            {editingTransaction ? 'Update' : 'Add'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

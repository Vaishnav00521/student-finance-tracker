import { motion } from 'framer-motion';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Edit,
    Trash2,
    ShoppingBag,
    Home,
    BookOpen,
    Music,
    Car,
    CreditCard,
    Zap,
    MoreHorizontal,
    Receipt,
    DollarSign
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
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

// Chart colors - cyber crimson palette
const CYBER_CRIMSON_PALETTE = ['#dc2626', '#b91c1c', '#ef4444', '#f87171', '#991b1b', '#7f1d1d', '#fca5a5', '#fecaca'];

export default function Dashboard() {
    const { transactions, summary, deleteTransaction, openEditModal, isLoading } = useApp();

    const recentTransactions = transactions.slice(0, 8);

    const getCategoryData = () => {
        const categoryMap = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
            });

        return Object.entries(categoryMap).map(([name, value]) => ({
            name,
            value: Math.round(value)
        })).sort((a, b) => b.value - a.value); // Sort by highest
    };

    const getMonthlyData = () => {
        const monthlyData = {};
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = format(date, 'MMM');
            monthlyData[key] = { income: 0, expense: 0 };
        }

        transactions.forEach(t => {
            const date = new Date(t.date);
            const key = format(date, 'MMM');
            if (monthlyData[key]) {
                if (t.type === 'income') {
                    monthlyData[key].income += t.amount;
                } else {
                    monthlyData[key].expense += t.amount;
                }
            }
        });

        return Object.entries(monthlyData).map(([month, data]) => ({
            month,
            income: Math.round(data.income),
            expense: Math.round(data.expense)
        }));
    };

    const categoryData = getCategoryData();
    const monthlyData = getMonthlyData();

    // Staggered Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-xl p-5 shadow-2xl">
                    <p className="text-slate-300 font-sans text-lg mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-2xl font-display font-bold" style={{ color: entry.color }}>
                            ${entry.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[500px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
        >
            {/* Summary Cards Row */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Total Balance Card */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 hover:border-slate-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all duration-300"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="p-4 bg-slate-800/80 rounded-xl">
                            <Wallet className="w-8 h-8 text-slate-300" />
                        </div>
                        <span className={`flex items-center gap-1 font-sans text-xl font-bold ${summary.totalBalance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {summary.totalBalance >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                        </span>
                    </div>
                    <p className="text-slate-400 font-sans text-xl mb-2">Total Balance</p>
                    <p className={`font-display text-5xl font-bold tracking-tight ${summary.totalBalance >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                        ${Math.abs(summary.totalBalance).toLocaleString()}
                    </p>
                </motion.div>

                {/* Monthly Income Card */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 hover:border-slate-700 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="p-4 bg-emerald-500/10 rounded-xl">
                            <TrendingUp className="w-8 h-8 text-emerald-500" />
                        </div>
                        <span className="flex items-center gap-1 text-emerald-500 font-sans text-xl font-bold">
                            <ArrowUpRight className="w-6 h-6" />
                        </span>
                    </div>
                    <p className="text-slate-400 font-sans text-xl mb-2">Monthly Income</p>
                    <p className="font-display text-5xl font-bold tracking-tight text-emerald-400">
                        ${summary.monthlyIncome.toLocaleString()}
                    </p>
                </motion.div>

                {/* Monthly Expenses Card */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 hover:border-slate-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all duration-300"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="p-4 bg-red-500/10 rounded-xl">
                            <TrendingDown className="w-8 h-8 text-red-500" />
                        </div>
                        <span className="flex items-center gap-1 text-red-500 font-sans text-xl font-bold">
                            <ArrowDownRight className="w-6 h-6" />
                        </span>
                    </div>
                    <p className="text-slate-400 font-sans text-xl mb-2">Monthly Expenses</p>
                    <p className="font-display text-5xl font-bold tracking-tight text-red-500">
                        ${summary.monthlyExpenses.toLocaleString()}
                    </p>
                </motion.div>
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Donut Chart (Expenses) */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 hover:border-slate-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)] transition-all duration-300"
                >
                    <h3 className="font-display text-3xl font-bold text-white mb-8">Expenses by Category</h3>
                    {categoryData.length > 0 ? (
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={90}
                                        outerRadius={140}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CYBER_CRIMSON_PALETTE[index % CYBER_CRIMSON_PALETTE.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[350px] flex items-center justify-center">
                            <div className="text-center">
                                <Receipt className="w-20 h-20 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500 font-sans text-xl">No expense data to visualize</p>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Bar Chart (Income vs Expense) */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 hover:border-slate-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)] transition-all duration-300"
                >
                    <h3 className="font-display text-3xl font-bold text-white mb-8">Cash Flow Overview</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis
                                    dataKey="month"
                                    stroke="#64748b"
                                    tick={{ fill: '#94a3b8', fontSize: 16, fontFamily: 'Outfit' }}
                                    axisLine={{ stroke: '#334155' }}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    tick={{ fill: '#94a3b8', fontSize: 16, fontFamily: 'Outfit' }}
                                    axisLine={{ stroke: '#334155' }}
                                    tickLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(51, 65, 85, 0.4)' }} />
                                <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} name="Income" maxBarSize={40} />
                                <Bar dataKey="expense" fill="#dc2626" radius={[8, 8, 0, 0]} name="Expense" maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </motion.div>

            {/* Recent Transactions Table */}
            <motion.div variants={itemVariants}>
                <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-8 hover:border-slate-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)] transition-all duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-display text-3xl font-bold text-white">Recent Transactions</h3>
                    </div>

                    {recentTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700/50 text-slate-400 font-sans text-lg">
                                        <th className="py-5 px-6 font-medium">Date</th>
                                        <th className="py-5 px-6 font-medium">Description</th>
                                        <th className="py-5 px-6 font-medium">Category</th>
                                        <th className="py-5 px-6 font-medium text-right">Amount</th>
                                        <th className="py-5 px-6 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((transaction, index) => {
                                        const Icon = categoryIcons[transaction.category] || MoreHorizontal;
                                        return (
                                            <motion.tr
                                                key={transaction._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                                className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors group"
                                            >
                                                <td className="py-6 px-6">
                                                    <span className="text-slate-300 font-sans text-lg">
                                                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-6">
                                                    <span className="text-white font-sans text-lg font-medium tracking-wide">
                                                        {transaction.description || '—'}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-xl ${transaction.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                                            <Icon className={`w-6 h-6 ${transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`} />
                                                        </div>
                                                        <span className="text-slate-300 font-sans text-lg">{transaction.category}</span>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-6 text-right">
                                                    <span className={`font-display text-3xl font-bold tracking-tight ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-500'}`}>
                                                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <motion.button
                                                            onClick={() => openEditModal(transaction)}
                                                            whileHover={{ scale: 1.15 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                                            title="Edit Transaction"
                                                        >
                                                            <Edit className="w-6 h-6" />
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => deleteTransaction(transaction._id)}
                                                            whileHover={{ scale: 1.15 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="p-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                            title="Delete Transaction"
                                                        >
                                                            <Trash2 className="w-6 h-6" />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <Receipt className="w-24 h-24 text-slate-700 mx-auto mb-6" />
                            <p className="text-slate-400 font-sans text-2xl mb-2">No transactions yet</p>
                            <p className="text-slate-500 font-sans text-lg">Add your first transaction to see it here.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

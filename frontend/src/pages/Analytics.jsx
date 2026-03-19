import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    LineChart,
    Line
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    Home,
    BookOpen,
    Music,
    Car,
    CreditCard,
    Zap,
    MoreHorizontal,
    Receipt
} from 'lucide-react';
import { useApp } from '../components/layout/MainLayout';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

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

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#f43f5e'];

export default function Analytics() {
    const { transactions, isLoading } = useApp();

    // Expense by category
    const expenseByCategory = useMemo(() => {
        const categoryMap = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
            });

        return Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value: Math.round(value) }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]);

    // Income by category
    const incomeByCategory = useMemo(() => {
        const categoryMap = {};
        transactions
            .filter(t => t.type === 'income')
            .forEach(t => {
                categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
            });

        return Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value: Math.round(value) }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]);

    // Monthly trends (last 6 months)
    const monthlyTrends = useMemo(() => {
        const now = new Date();
        const months = eachMonthOfInterval({
            start: subMonths(now, 5),
            end: now
        });

        return months.map(month => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);

            const income = transactions
                .filter(t => {
                    const date = new Date(t.date);
                    return t.type === 'income' && date >= monthStart && date <= monthEnd;
                })
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = transactions
                .filter(t => {
                    const date = new Date(t.date);
                    return t.type === 'expense' && date >= monthStart && date <= monthEnd;
                })
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                month: format(month, 'MMM'),
                income: Math.round(income),
                expense: Math.round(expense),
                balance: Math.round(income - expense)
            };
        });
    }, [transactions]);

    // Daily spending (last 7 days)
    const dailySpending = useMemo(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStart = new Date(date.setHours(0, 0, 0, 0));
            const dayEnd = new Date(date.setHours(23, 59, 59, 999));

            const spending = transactions
                .filter(t => {
                    const tDate = new Date(t.date);
                    return t.type === 'expense' && tDate >= dayStart && tDate <= dayEnd;
                })
                .reduce((sum, t) => sum + t.amount, 0);

            days.push({
                day: format(dayStart, 'EEE'),
                amount: Math.round(spending)
            });
        }
        return days;
    }, [transactions]);

    // Stats
    const stats = useMemo(() => {
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const avgDailyExpense = totalExpense / 30;
        const avgTransaction = (totalIncome + totalExpense) / transactions.length || 0;

        return { totalIncome, totalExpense, avgDailyExpense, avgTransaction };
    }, [transactions]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl p-4 shadow-xl">
                    <p className="text-slate-300 text-base mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-lg font-display font-bold" style={{ color: entry.color }}>
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
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total Income"
                    value={stats.totalIncome}
                    icon={TrendingUp}
                    color="emerald"
                />
                <StatCard
                    title="Total Expenses"
                    value={stats.totalExpense}
                    icon={TrendingDown}
                    color="red"
                />
                <StatCard
                    title="Avg Daily Spend"
                    value={stats.avgDailyExpense}
                    icon={DollarSign}
                    color="orange"
                />
                <StatCard
                    title="Avg Transaction"
                    value={stats.avgTransaction}
                    icon={CreditCard}
                    color="purple"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Categories Pie */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card rounded-2xl p-7"
                >
                    <h3 className="font-display text-2xl font-bold text-white mb-2">Expense Breakdown</h3>
                    <p className="text-slate-400 text-base mb-6">Where your money goes</p>

                    {expenseByCategory.length > 0 ? (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseByCategory}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={110}
                                        innerRadius={70}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {expenseByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center">
                            <div className="text-center">
                                <Receipt className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 text-xl">No expense data</p>
                            </div>
                        </div>
                    )}
                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-4 justify-center">
                        {expenseByCategory.slice(0, 6).map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-slate-400 text-sm">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Income Categories Pie */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-2xl p-7"
                >
                    <h3 className="font-display text-2xl font-bold text-white mb-2">Income Sources</h3>
                    <p className="text-slate-400 text-base mb-6">Where your money comes from</p>

                    {incomeByCategory.length > 0 ? (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={incomeByCategory}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={110}
                                        innerRadius={70}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {incomeByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center">
                            <div className="text-center">
                                <Receipt className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 text-xl">No income data</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trends */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-2xl p-7"
                >
                    <h3 className="font-display text-2xl font-bold text-white mb-2">Monthly Trends</h3>
                    <p className="text-slate-400 text-base mb-6">Income vs Expenses over time</p>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    dataKey="month"
                                    stroke="#94a3b8"
                                    tick={{ fill: '#94a3b8', fontSize: 14 }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    tick={{ fill: '#94a3b8', fontSize: 14 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} name="Income" />
                                <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expense" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Daily Spending */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-2xl p-7"
                >
                    <h3 className="font-display text-2xl font-bold text-white mb-2">Last 7 Days</h3>
                    <p className="text-slate-400 text-base mb-6">Your daily spending pattern</p>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailySpending}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    dataKey="day"
                                    stroke="#94a3b8"
                                    tick={{ fill: '#94a3b8', fontSize: 14 }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    tick={{ fill: '#94a3b8', fontSize: 14 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                                    activeDot={{ r: 8, fill: '#ef4444' }}
                                    name="Spending"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Category Details Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-2xl p-7"
            >
                <h3 className="font-display text-2xl font-bold text-white mb-6">Category Details</h3>

                {expenseByCategory.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left py-4 px-4 text-slate-400 font-medium text-lg">Category</th>
                                    <th className="text-right py-4 px-4 text-slate-400 font-medium text-lg">Expenses</th>
                                    <th className="text-right py-4 px-4 text-slate-400 font-medium text-lg">% of Total</th>
                                    <th className="text-right py-4 px-4 text-slate-400 font-medium text-lg">Income</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenseByCategory.map((cat, index) => {
                                    const Icon = categoryIcons[cat.name] || MoreHorizontal;
                                    const incomeCat = incomeByCategory.find(ic => ic.name === cat.name);
                                    const totalExpense = expenseByCategory.reduce((sum, e) => sum + e.value, 0);
                                    const percentage = totalExpense > 0 ? ((cat.value / totalExpense) * 100).toFixed(1) : 0;

                                    return (
                                        <motion.tr
                                            key={cat.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-slate-800/50 hover:bg-slate-800/30"
                                        >
                                            <td className="py-5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}>
                                                        <Icon className="w-5 h-5" style={{ color: COLORS[index % COLORS.length] }} />
                                                    </div>
                                                    <span className="text-white text-lg font-medium">{cat.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 text-right">
                                                <span className="text-red-500 text-2xl font-display font-bold">${cat.value.toLocaleString()}</span>
                                            </td>
                                            <td className="py-5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <div className="w-28 h-2.5 bg-slate-700 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            transition={{ duration: 0.5, delay: 0.2 }}
                                                            className="h-full rounded-full"
                                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                        />
                                                    </div>
                                                    <span className="text-slate-400 text-base w-16 text-right">{percentage}%</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 text-right">
                                                <span className="text-emerald-400 text-2xl font-display font-bold">
                                                    ${incomeCat ? incomeCat.value.toLocaleString() : 0}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <Receipt className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-xl">No data available</p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color }) {
    const colorClasses = {
        emerald: 'bg-emerald-500/10 text-emerald-500',
        red: 'bg-red-500/10 text-red-500',
        orange: 'bg-orange-500/10 text-orange-500',
        purple: 'bg-purple-500/10 text-purple-500'
    };

    const iconBgClasses = {
        emerald: 'bg-emerald-500/10',
        red: 'bg-red-500/10',
        orange: 'bg-orange-500/10',
        purple: 'bg-purple-500/10'
    };

    const textClasses = {
        emerald: 'text-emerald-400',
        red: 'text-red-500',
        orange: 'text-orange-400',
        purple: 'text-purple-400'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card rounded-2xl p-6 hover:shadow-glow-lg transition-all duration-300"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-base">{title}</p>
                    <p className={`font-display text-4xl font-bold mt-1 ${textClasses[color]}`}>
                        ${Math.round(value).toLocaleString()}
                    </p>
                </div>
                <div className={`p-4 rounded-xl ${iconBgClasses[color]}`}>
                    <Icon className={`w-7 h-7 ${textClasses[color]}`} />
                </div>
            </div>
        </motion.div>
    );
}

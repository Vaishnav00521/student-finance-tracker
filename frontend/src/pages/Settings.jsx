import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Bell,
    Shield,
    Download,
    Trash2,
    Wallet,
    Target,
    Save,
    Mail,
    Calendar,
    TrendingUp
} from 'lucide-react';
import { useApp } from '../components/layout/MainLayout';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function Settings() {
    const { transactions, summary } = useApp();
    const [activeTab, setActiveTab] = useState('profile');
    const [budget, setBudget] = useState(500);
    const [notifications, setNotifications] = useState(true);
    const [email, setEmail] = useState('student@university.edu');
    const [name, setName] = useState('Student User');

    const handleSaveProfile = () => {
        toast.success('Profile updated successfully!');
    };

    const handleSaveBudget = () => {
        toast.success('Budget settings saved!');
    };

    const handleExport = () => {
        // CSV Export functionality
        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
        const csvData = transactions.map(t => [
            format(new Date(t.date), 'yyyy-MM-dd'),
            t.description || '',
            t.category,
            t.type,
            t.amount
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `expenses_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Transactions exported to CSV!');
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to delete all transactions? This action cannot be undone.')) {
            toast.success('All data cleared (demo only - API not connected)');
        }
    };

    const budgetProgress = summary.monthlyExpenses > 0
        ? Math.min((summary.monthlyExpenses / budget) * 100, 100)
        : 0;

    const getBudgetColor = () => {
        if (budgetProgress >= 90) return 'bg-red-500';
        if (budgetProgress >= 70) return 'bg-orange-500';
        return 'bg-emerald-500';
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'budget', label: 'Budget', icon: Target },
        { id: 'export', label: 'Export Data', icon: Download },
        { id: 'danger', label: 'Danger Zone', icon: Trash2 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="mb-8">
                <h2 className="font-display text-4xl font-bold text-white">Settings</h2>
                <p className="text-slate-400 text-lg mt-1">Manage your account and preferences</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl overflow-hidden"
            >
                {/* Tabs */}
                <div className="flex border-b border-slate-800 overflow-x-auto">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 px-6 py-5 text-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </motion.button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            {/* Avatar */}
                            <div className="flex items-center gap-6">
                                <motion.div
                                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-glow"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <User className="w-12 h-12 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="font-display text-3xl font-bold text-white">{name}</h3>
                                    <p className="text-slate-400 text-lg">Student Account</p>
                                    <p className="text-slate-500 text-sm mt-1">Member since {format(new Date(), 'MMMM yyyy')}</p>
                                </div>
                            </div>

                            {/* Profile Form */}
                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-slate-400 text-base mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-lg focus:outline-none focus:border-red-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-400 text-base mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-lg focus:outline-none focus:border-red-500"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    onClick={handleSaveProfile}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-display text-xl font-bold shadow-glow hover:shadow-glow-strong transition-all"
                                >
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Budget Tab */}
                    {activeTab === 'budget' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            {/* Current Budget */}
                            <div className="glass-card rounded-xl p-7 bg-slate-800/50">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h4 className="text-white text-2xl font-display font-bold">Monthly Budget</h4>
                                        <p className="text-slate-400 text-base mt-1">Set your monthly spending limit</p>
                                    </div>
                                    <Target className="w-8 h-8 text-red-500" />
                                </div>

                                <div className="mb-5">
                                    <div className="flex items-center justify-between text-base mb-3">
                                        <span className="text-slate-400">Spent</span>
                                        <span className="text-white font-display text-xl font-bold">
                                            ${summary.monthlyExpenses.toLocaleString()} / ${budget.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-5 bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${budgetProgress}%` }}
                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                            className={`h-full rounded-full ${getBudgetColor()}`}
                                        />
                                    </div>
                                    <p className="text-right text-base mt-2 text-slate-400">
                                        {budgetProgress.toFixed(0)}% used
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-slate-400 text-base mb-2">Budget Amount ($)</label>
                                    <input
                                        type="number"
                                        value={budget}
                                        onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                                        className="w-full px-4 py-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-2xl font-display font-bold focus:outline-none focus:border-red-500"
                                    />
                                </div>

                                <motion.button
                                    onClick={handleSaveBudget}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 mt-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-display text-xl font-bold shadow-glow hover:shadow-glow-strong transition-all"
                                >
                                    <Save className="w-5 h-5" />
                                    Save Budget
                                </motion.button>
                            </div>

                            {/* Budget Tips */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6"
                                >
                                    <Target className="w-8 h-8 text-emerald-500 mb-3" />
                                    <h5 className="text-white font-display font-bold text-xl mb-2">50/30/20 Rule</h5>
                                    <p className="text-slate-400 text-base">Allocate 50% for needs, 30% for wants, and 20% for savings</p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6"
                                >
                                    <Wallet className="w-8 h-8 text-blue-500 mb-3" />
                                    <h5 className="text-white font-display font-bold text-xl mb-2">Track Daily</h5>
                                    <p className="text-slate-400 text-base">Review spending daily to stay on track with your goals</p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6"
                                >
                                    <TrendingUp className="w-8 h-8 text-purple-500 mb-3" />
                                    <h5 className="text-white font-display font-bold text-xl mb-2">Adjust Monthly</h5>
                                    <p className="text-slate-400 text-base">Review and adjust your budget based on last month's spending</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Export Tab */}
                    {activeTab === 'export' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="text-center py-10">
                                <motion.div
                                    className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Download className="w-12 h-12 text-red-500" />
                                </motion.div>
                                <h3 className="font-display text-3xl font-bold text-white mb-2">Export Your Data</h3>
                                <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                                    Download all your transactions as a CSV file for backup or analysis in spreadsheets.
                                </p>

                                <motion.button
                                    onClick={handleExport}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-display text-xl font-bold shadow-glow hover:shadow-glow-strong transition-all mx-auto"
                                >
                                    <Download className="w-6 h-6" />
                                    Export as CSV
                                </motion.button>
                            </div>

                            <div className="border-t border-slate-800 pt-8">
                                <h4 className="text-white text-2xl font-display font-bold mb-5">Export Details</h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-slate-800/50 rounded-xl p-5"
                                    >
                                        <p className="text-slate-400 text-base">Total Transactions</p>
                                        <p className="text-white text-3xl font-display font-bold">{transactions.length}</p>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-slate-800/50 rounded-xl p-5"
                                    >
                                        <p className="text-slate-400 text-base">Data Range</p>
                                        <p className="text-white text-xl font-display font-bold">
                                            {transactions.length > 0
                                                ? `${format(new Date(Math.min(...transactions.map(t => new Date(t.date)))), 'MMM yyyy')} - ${format(new Date(), 'MMM yyyy')}`
                                                : 'No data'
                                            }
                                        </p>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Danger Zone Tab */}
                    {activeTab === 'danger' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-7">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="p-4 bg-red-500/10 rounded-xl">
                                        <Trash2 className="w-7 h-7 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white text-2xl font-display font-bold">Delete All Data</h4>
                                        <p className="text-slate-400 text-base">Permanently remove all transactions</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-base mb-5">
                                    This action cannot be undone. All your transaction history will be permanently deleted.
                                    Consider exporting your data before proceeding.
                                </p>
                                <motion.button
                                    onClick={handleClearData}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-7 py-4 bg-red-600 text-white rounded-xl font-display text-lg font-bold hover:bg-red-700 transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete All Transactions
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

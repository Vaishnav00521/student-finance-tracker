import { useState, createContext, useContext, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Receipt,
    PieChart,
    Settings,
    Plus,
    X,
    Wallet,
    DollarSign
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// Simple API URL
const API_URL = 'http://localhost:5000/api';

// Create context for global state
const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export default function MainLayout() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    // Initialize user and fetch data
    useEffect(() => {
        const initSession = async () => {
            try {
                setIsLoading(true);
                
                // Get or create user
                const response = await fetch(`${API_URL}/users/demo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const userData = await response.json();
                setUser(userData);
                localStorage.setItem('demoUserId', userData._id);

                // Fetch transactions
                const transResponse = await fetch(`${API_URL}/transactions?userId=${userData._id}`);
                const transData = await transResponse.json();
                setTransactions(transData);
            } catch (err) {
                console.error("Connection failed", err);
                toast.error("Connecting to server...");
            } finally {
                setIsLoading(false);
            }
        };

        initSession();
    }, []);

    const fetchTransactions = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API_URL}/transactions?userId=${user._id}`);
            const data = await res.json();
            setTransactions(data);
        } catch (err) {
            console.error(err);
        }
    };

    const addTransaction = async (formData) => {
        if (!user) return;
        
        const payload = { ...formData, userId: user._id };
        const method = editingTransaction ? 'PUT' : 'POST';
        const url = editingTransaction 
            ? `${API_URL}/transactions/${editingTransaction._id}`
            : `${API_URL}/transactions`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Save failed");
            
            const savedData = await res.json();
            
            if (editingTransaction) {
                setTransactions(transactions.map(t => t._id === editingTransaction._id ? savedData : t));
                toast.success("Updated!");
            } else {
                setTransactions([savedData, ...transactions]);
                toast.success("Saved!");
            }
            closeModal();
        } catch (err) {
            toast.error("Could not save transaction");
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
            setTransactions(transactions.filter(t => t._id !== id));
            toast.success("Deleted");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const openEditModal = (t) => { setEditingTransaction(t); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingTransaction(null); };

    // Calculate dynamic balance
    const calculateSummary = () => {
        const totalInc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const totalExp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        
        const now = new Date();
        const monthInc = transactions.filter(t => {
            const d = new Date(t.date);
            return t.type === 'income' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).reduce((s, t) => s + t.amount, 0);

        const monthExp = transactions.filter(t => {
            const d = new Date(t.date);
            return t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).reduce((s, t) => s + t.amount, 0);

        return {
            totalBalance: totalInc - totalExp,
            monthlyIncome: monthInc,
            monthlyExpenses: monthExp
        };
    };

    const summary = calculateSummary();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/transactions', icon: Receipt, label: 'Transactions' },
        { path: '/analytics', icon: PieChart, label: 'Analytics' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <AppContext.Provider value={{ transactions, summary, addTransaction, deleteTransaction, openEditModal, isLoading, fetchTransactions }}>
            <div className="flex h-screen w-full overflow-hidden bg-slate-950">
                {/* Background effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-950/20 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-950/20 blur-[100px] rounded-full"></div>
                    <div className="zigzag-bg"></div>
                </div>

                <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-10">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-3 bg-red-600 rounded-xl shadow-glow">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="font-display text-2xl font-bold text-white">Expense</h1>
                        </div>
                        <nav className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                                            isActive ? 'bg-red-600 text-white shadow-glow' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`
                                    }
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-sans">{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto p-6">
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-3 w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-display text-lg font-bold transition-all">
                            <Plus className="w-5 h-5" /> Add Transaction
                        </button>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto p-8 lg:p-10 relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div key={location.pathname} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>

                <AnimatePresence>
                    {isModalOpen && <TransactionModal isOpen={isModalOpen} onClose={closeModal} onSubmit={addTransaction} editingTransaction={editingTransaction} />}
                </AnimatePresence>
                <Toaster position="top-right" />
            </div>
        </AppContext.Provider>
    );
}

function TransactionModal({ isOpen, onClose, onSubmit, editingTransaction }) {
    const [formData, setFormData] = useState({
        amount: '', type: 'expense', category: 'Food', description: '', date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (editingTransaction) {
            setFormData({
                amount: editingTransaction.amount.toString(),
                type: editingTransaction.type,
                category: editingTransaction.category,
                description: editingTransaction.description,
                date: new Date(editingTransaction.date).toISOString().split('T')[0]
            });
        }
    }, [editingTransaction]);

    const cats = {
        expense: ['Food', 'Rent', 'Education', 'Entertainment', 'Transport', 'Shopping', 'Utilities', 'Other'],
        income: ['Allowance', 'Part-time Job', 'Scholarship', 'Gift', 'Other']
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <h3 className="font-display text-2xl font-bold text-white mb-6">
                    {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...formData, amount: parseFloat(formData.amount) }); }} className="space-y-5">
                    <div className="flex gap-3">
                        {['expense', 'income'].map((t) => (
                            <button key={t} type="button" onClick={() => setFormData({ ...formData, type: t, category: cats[t][0] })}
                                className={`flex-1 py-4 rounded-xl font-display text-lg font-bold capitalize transition-all ${
                                    formData.type === t ? (t === 'expense' ? 'bg-red-600 shadow-glow' : 'bg-emerald-600 shadow-glow') : 'bg-slate-800 text-slate-400'
                                }`}>{t}</button>
                        ))}
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">Amount</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-2xl font-display font-bold focus:outline-none focus:border-red-500" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">Category</label>
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-lg focus:outline-none focus:border-red-500">
                            {cats[formData.type].map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">Description</label>
                        <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-lg focus:outline-none focus:border-red-500" />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">Date</label>
                        <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-lg focus:outline-none focus:border-red-500" required />
                    </div>
                    <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-display text-xl font-bold shadow-glow transition-all">
                        {editingTransaction ? 'Update' : 'Save'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Receipt,
    PieChart,
    Settings,
    Wallet,
    X,
    ChevronLeft
} from 'lucide-react';
import { cn } from '../utils/cn';

/**
 * Sidebar - Navigation sidebar with icons and animations
 */
export default function Sidebar({ isOpen, onClose, currentPage, onNavigate }) {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'transactions', icon: Receipt, label: 'Transactions' },
        { id: 'analytics', icon: PieChart, label: 'Analytics' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: isOpen ? 0 : -280,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={cn(
                    'fixed left-0 top-0 bottom-0 w-72 z-50',
                    'bg-white dark:bg-slate-900',
                    'border-r border-slate-200 dark:border-slate-800',
                    'lg:translate-x-0 lg:static'
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl text-slate-800 dark:text-white">
                            ExpenseTrack
                        </span>
                    </motion.div>

                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;

                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    onClose();
                                }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl',
                                    'transition-all duration-200',
                                    isActive
                                        ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-2 h-2 bg-white rounded-full"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Need Help?
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                            Check our documentation
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-2.5 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-semibold shadow-sm"
                        >
                            View Docs
                        </motion.button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

/**
 * MobileHeader - Top header for mobile
 */
export function MobileHeader({ onMenuClick, user }) {
    return (
        <header className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-600 dark:text-slate-400"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">
                        ExpenseTrack
                    </span>
                </div>

                {user && (
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {user.name?.charAt(0) || 'U'}
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
}

/**
 * ThemeToggle - Sun/Moon toggle switch
 */
export function ThemeToggle({ isDark, onToggle }) {
    return (
        <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
                'relative w-14 h-8 rounded-full p-1',
                'bg-slate-200 dark:bg-slate-700',
                'transition-colors duration-200'
            )}
        >
            <motion.div
                animate={{ x: isDark ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center',
                    isDark
                        ? 'bg-slate-800'
                        : 'bg-yellow-500'
                )}
            >
                {isDark ? (
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                )}
            </motion.div>
        </motion.button>
    );
}

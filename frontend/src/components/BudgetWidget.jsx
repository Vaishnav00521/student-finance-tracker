import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';
import { formatCurrency } from '../utils/cn';

/**
 * BudgetWidget - Animated progress bar with dynamic colors
 */
export default function BudgetWidget({ totalExpenses, budgetLimit = 1000 }) {
    // Calculate percentage
    const percentage = Math.min((totalExpenses / budgetLimit) * 100, 100);

    // Determine color based on percentage
    const getColorClass = () => {
        if (percentage < 75) return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
        if (percentage < 90) return 'bg-gradient-to-r from-amber-400 to-orange-500';
        return 'bg-gradient-to-r from-rose-500 to-red-600';
    };

    const getStatusColor = () => {
        if (percentage < 75) return 'text-emerald-600 dark:text-emerald-400';
        if (percentage < 90) return 'text-amber-600 dark:text-amber-400';
        return 'text-rose-600 dark:text-rose-400';
    };

    const getStatusText = () => {
        if (percentage < 75) return 'On Track';
        if (percentage < 90) return 'Near Limit';
        return 'Over Budget';
    };

    const remaining = budgetLimit - totalExpenses;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/50 dark:border-slate-700/50"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
                    >
                        <Target className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Monthly Budget</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Track your spending</p>
                    </div>
                </div>

                {/* Status Badge */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5',
                        'bg-slate-100 dark:bg-slate-700',
                        getStatusColor()
                    )}
                >
                    {percentage >= 90 ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                        <TrendingUp className="w-3.5 h-3.5" />
                    )}
                    {getStatusText()}
                </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatCurrency(totalExpenses)}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                        of {formatCurrency(budgetLimit)}
                    </span>
                </div>

                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        className={cn('h-full rounded-full', getColorClass())}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Spent</p>
                    <p className={cn('font-bold text-lg', getStatusColor())}>
                        {formatCurrency(totalExpenses)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {remaining >= 0 ? 'Remaining' : 'Over by'}
                    </p>
                    <p className={cn(
                        'font-bold text-lg',
                        remaining >= 0 ? 'text-slate-700 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400'
                    )}>
                        {formatCurrency(Math.abs(remaining))}
                    </p>
                </div>
            </div>

            {/* Percentage Display */}
            <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <span className={cn(
                    'text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent',
                    getStatusColor()
                )}>
                    {percentage.toFixed(0)}%
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
                    used
                </span>
            </motion.div>
        </motion.div>
    );
}

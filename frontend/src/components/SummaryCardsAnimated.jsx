import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/cn';

// Animation variants for staggered entrance
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25
        }
    },
};

/**
 * Summary Card with glassmorphism and hover animations
 */
function SummaryCard({ title, amount, icon: Icon, color, delay }) {
    const colorClasses = {
        purple: {
            bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
            icon: 'bg-gradient-to-br from-violet-500 to-purple-600',
            text: 'text-violet-600',
        },
        green: {
            bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
            icon: 'bg-gradient-to-br from-emerald-500 to-green-600',
            text: 'text-emerald-600',
        },
        red: {
            bg: 'bg-gradient-to-br from-rose-50 to-red-50',
            icon: 'bg-gradient-to-br from-rose-500 to-red-600',
            text: 'text-rose-600',
        },
    };

    const colors = colorClasses[color];

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/50 hover:shadow-xl transition-shadow duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-14 h-14 rounded-2xl ${colors.icon} flex items-center justify-center shadow-lg`}
                >
                    <Icon className="w-7 h-7 text-white" />
                </motion.div>
            </div>
            <p className="text-slate-500 font-medium mb-1">{title}</p>
            <motion.p
                className="text-3xl font-bold text-slate-800"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2, type: 'spring' }}
            >
                {formatCurrency(amount)}
            </motion.p>
        </motion.div>
    );
}

/**
 * Summary Cards Container with staggered animations
 */
export default function SummaryCardsAnimated({ summary }) {
    if (!summary) {
        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6"
            >
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/50"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl animate-pulse" />
                        </div>
                        <div className="h-4 bg-slate-100 rounded w-24 mb-2" />
                        <div className="h-8 bg-slate-100 rounded w-32" />
                    </motion.div>
                ))}
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6"
        >
            <SummaryCard
                title="Total Balance"
                amount={summary.balance}
                icon={Wallet}
                color="purple"
                delay={0}
            />
            <SummaryCard
                title="Monthly Income"
                amount={summary.monthlyIncome}
                icon={TrendingUp}
                color="green"
                delay={0.1}
            />
            <SummaryCard
                title="Monthly Expenses"
                amount={summary.monthlyExpenses}
                icon={TrendingDown}
                color="red"
                delay={0.2}
            />
        </motion.div>
    );
}

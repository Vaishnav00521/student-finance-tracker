import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/cn';

/**
 * Summary Card Component
 * Displays key financial metrics with icons
 */
function SummaryCard({ title, amount, icon: Icon, trend, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-emerald-50 text-emerald-600',
        red: 'bg-rose-50 text-rose-600',
        purple: 'bg-violet-50 text-violet-600',
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(amount)}</p>
        </div>
    );
}

/**
 * Summary Cards Container
 * Renders all three summary cards
 */
export default function SummaryCards({ summary }) {
    if (!summary) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                        </div>
                        <div className="h-4 bg-slate-100 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-slate-100 rounded w-32"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard
                title="Total Balance"
                amount={summary.balance}
                icon={Wallet}
                color="purple"
            />
            <SummaryCard
                title="Monthly Income"
                amount={summary.monthlyIncome}
                icon={TrendingUp}
                color="green"
            />
            <SummaryCard
                title="Monthly Expenses"
                amount={summary.monthlyExpenses}
                icon={TrendingDown}
                color="red"
            />
        </div>
    );
}

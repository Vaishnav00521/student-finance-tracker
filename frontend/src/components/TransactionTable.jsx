import { format } from 'date-fns';
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, categoryColors } from '../utils/cn';

/**
 * Transaction Table Component
 * Displays recent transactions with edit/delete actions
 */
export default function TransactionTable({ transactions, onEdit, onDelete, loading }) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
                </div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-100 rounded w-32"></div>
                                <div className="h-3 bg-slate-100 rounded w-24"></div>
                            </div>
                            <div className="h-4 bg-slate-100 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
                </div>
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ArrowUpRight className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No transactions yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your first transaction to get started</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
            </div>
            <div className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                    <div
                        key={transaction._id}
                        className="p-4 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center justify-between gap-4">
                            {/* Category Icon & Details */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: `${categoryColors[transaction.category]}15` }}
                                >
                                    {transaction.type === 'income' ? (
                                        <ArrowUpRight
                                            className="w-5 h-5"
                                            style={{ color: categoryColors[transaction.category] }}
                                        />
                                    ) : (
                                        <ArrowDownRight
                                            className="w-5 h-5"
                                            style={{ color: categoryColors[transaction.category] }}
                                        />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-800 truncate">
                                        {transaction.category}
                                    </p>
                                    <p className="text-sm text-slate-500 truncate">
                                        {transaction.description || format(new Date(transaction.date), 'MMM d, yyyy')}
                                    </p>
                                </div>
                            </div>

                            {/* Amount & Actions */}
                            <div className="flex items-center gap-4 flex-shrink-0">
                                <p
                                    className={`font-semibold text-base ${transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                                        }`}
                                >
                                    {transaction.type === 'income' ? '+' : '-'}
                                    {formatCurrency(transaction.amount)}
                                </p>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onEdit(transaction)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(transaction._id)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

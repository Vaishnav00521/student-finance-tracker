import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { categoryColors, formatCurrency } from '../utils/cn';

/**
 * Expense Chart Component
 * Pie chart showing expenses by category
 */
export default function ExpenseChart({ data, loading }) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-80">
                <div className="animate-pulse h-full flex items-center justify-center">
                    <div className="w-48 h-48 bg-slate-100 rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-80">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Expenses by Category</h2>
                <div className="h-full flex items-center justify-center">
                    <p className="text-slate-400">No expense data to display</p>
                </div>
            </div>
        );
    }

    // Transform data for the chart
    const chartData = data.map((item) => ({
        name: item._id,
        value: item.total,
        color: categoryColors[item._id] || '#64748b',
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
                    <p className="font-medium">{payload[0].name}</p>
                    <p className="text-slate-300">{formatCurrency(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => {
        return (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-slate-600">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Expenses by Category</h2>
            <p className="text-sm text-slate-500 mb-4">This month's spending breakdown</p>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
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
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { categoryColors, formatCurrency } from '../utils/cn';

/**
 * ExpenseChartAnimated - Pie chart with smooth fade/scale in animation
 */
export default function ExpenseChartAnimated({ data, loading }) {
    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/50 h-80"
            >
                <div className="animate-pulse h-full flex items-center justify-center">
                    <div className="w-56 h-56 bg-slate-100 rounded-full" />
                </div>
            </motion.div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/50 h-80"
            >
                <h2 className="text-xl font-bold text-slate-800 mb-2">Expenses by Category</h2>
                <p className="text-sm text-slate-500 mb-4">This month's spending breakdown</p>
                <div className="h-full flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="text-center"
                    >
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto mb-3" />
                        <p className="text-slate-400">No expense data</p>
                    </motion.div>
                </div>
            </motion.div>
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
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-800/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl"
                >
                    <p className="font-bold">{payload[0].name}</p>
                    <p className="text-slate-300 text-sm">{formatCurrency(payload[0].value)}</p>
                </motion.div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-3 mt-4"
            >
                {payload.map((entry, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index + 0.3 }}
                        className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full"
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm font-medium text-slate-600">{entry.value}</span>
                    </motion.div>
                ))}
            </motion.div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/50"
        >
            <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold text-slate-800 mb-1"
            >
                Expenses by Category
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-slate-500 mb-4"
            >
                This month's spending breakdown
            </motion.p>

            <div className="h-64">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke="transparent"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={<CustomLegend />} />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </motion.div>
    );
}

import { format } from 'date-fns';

/**
 * exportToCSV - Convert transactions to downloadable CSV file
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Name of the file (optional)
 */
export function exportToCSV(transactions, filename = 'transactions') {
    if (!transactions || transactions.length === 0) {
        console.warn('No transactions to export');
        return false;
    }

    // CSV Headers
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];

    // Map transactions to CSV rows
    const rows = transactions.map(t => [
        format(new Date(t.date), 'yyyy-MM-dd'),
        t.type,
        t.category,
        t.amount.toString(),
        t.description || ''
    ]);

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => {
            // Escape cells with commas or quotes
            const escaped = String(cell).replace(/"/g, '""');
            return escaped.includes(',') || escaped.includes('"')
                ? `"${escaped}"`
                : escaped;
        }).join(','))
    ].join('\n');

    // Create Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create link element
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    return true;
}

/**
 * exportSummaryToCSV - Export summary data as CSV
 * @param {Object} summary - Summary object with income/expense data
 * @param {string} filename - Name of the file
 */
export function exportSummaryToCSV(summary, filename = 'financial_summary') {
    if (!summary) return false;

    const headers = ['Category', 'Amount', 'Type'];
    const rows = [];

    // Add totals
    rows.push(['Total Income', summary.totalIncome?.toString() || '0', 'Income']);
    rows.push(['Total Expenses', summary.totalExpenses?.toString() || '0', 'Expense']);
    rows.push(['Balance', summary.balance?.toString() || '0', 'Balance']);

    // Add category breakdown if available
    if (summary.expensesByCategory?.length > 0) {
        rows.push(['', '', '']); // Empty row
        rows.push(['Expenses by Category', '', '']);
        summary.expensesByCategory.forEach(cat => {
            rows.push([cat._id, cat.total.toString(), 'Expense']);
        });
    }

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => {
            const escaped = String(cell).replace(/"/g, '""');
            return escaped.includes(',') || escaped.includes('"')
                ? `"${escaped}"`
                : escaped;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    return true;
}

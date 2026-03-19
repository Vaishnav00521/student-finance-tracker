import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge tailwind classes
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency to Indian Rupees
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Category colors for charts
 */
export const categoryColors = {
    Food: '#f59e0b',
    Rent: '#6366f1',
    Education: '#8b5cf6',
    Entertainment: '#ec4899',
    Allowance: '#10b981',
    Transportation: '#3b82f6',
    Shopping: '#f97316',
    Health: '#14b8a6',
    Other: '#64748b',
};

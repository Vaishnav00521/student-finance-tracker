import axios from 'axios';

// Strict fallback to localhost:5000 if env is missing
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log("Axios initialized with Base URL:", API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper for error logging
const logApiError = (operation, error) => {
    console.error(`API Error (${operation}):`, error.message);
    if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
    }
};

// User APIs
export const getOrCreateDemoUser = async () => {
    try {
        const response = await api.post('/users/demo');
        return response.data;
    } catch (error) {
        logApiError("getOrCreateDemoUser", error);
        throw error;
    }
};

export const getUser = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        logApiError("getUser", error);
        throw error;
    }
};

// Transaction APIs
export const getTransactions = async (userId) => {
    try {
        const response = await api.get(`/transactions?userId=${userId}`);
        return response.data;
    } catch (error) {
        logApiError("getTransactions", error);
        throw error;
    }
};

export const createTransaction = async (transactionData) => {
    try {
        const response = await api.post('/transactions', transactionData);
        return response.data;
    } catch (error) {
        logApiError("createTransaction", error);
        throw error;
    }
};

export const updateTransaction = async (id, transactionData) => {
    try {
        const response = await api.put(`/transactions/${id}`, transactionData);
        return response.data;
    } catch (error) {
        logApiError("updateTransaction", error);
        throw error;
    }
};

export const deleteTransaction = async (id) => {
    try {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    } catch (error) {
        logApiError("deleteTransaction", error);
        throw error;
    }
};

export const getSummary = async (userId) => {
    try {
        const response = await api.get(`/transactions/summary?userId=${userId}`);
        return response.data;
    } catch (error) {
        logApiError("getSummary", error);
        throw error;
    }
};

export default api;

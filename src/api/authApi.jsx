// src/api/authApi.js
import apiClient from './apiClient';
import axios from 'axios';



export const loginApi = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
};


export const refreshApi = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        return Promise.reject(new Error('No refresh token available'));
    }

    const base = import.meta.env.VITE_BACKEND_API_HOST || 'http://localhost:3000';
    const response = await axios.get(
        `${base}/auth/refresh`,
        {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        }
    );

    return response.data;
};


export const registerApi = async (payload) => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
};
// src/api/apiClient.js

import axios from 'axios';
import { refreshApi } from './authApi';

let inMemoryAccessToken = null;

export const setAuthToken = (token) => {
    console.log("apiClient: Đặt token trong bộ nhớ:", token);
    inMemoryAccessToken = token;
};

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

apiClient.interceptors.request.use(
    (config) => {
        if (inMemoryAccessToken) {
            config.headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const requestUrl = originalRequest.url || '';
        let pathname = requestUrl;
        try {
            const base = apiClient.defaults.baseURL || window.location.origin;
            pathname = new URL(requestUrl, base).pathname;
        } catch (e) {
            pathname = requestUrl;
        }

        const isAuthOrRefresh = pathname.endsWith('/auth/login') || pathname.endsWith('/auth/refresh');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthOrRefresh) {
            console.log('Response Interceptor: Lỗi 401 (token hết hạn), đang thử làm mới...');
            originalRequest._retry = true;

            try {
                const data = await refreshApi();
                const newAccessToken = data.accessToken;

                setAuthToken(newAccessToken);
                window.dispatchEvent(
                    new CustomEvent('tokenRefreshed', { detail: newAccessToken }),
                );
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('Response Interceptor: Refresh token thất bại!', refreshError);
                window.dispatchEvent(new Event('logout'));
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default apiClient;
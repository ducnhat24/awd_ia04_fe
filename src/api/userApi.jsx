import apiClient from './apiClient';
export const getMeApi = async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
};
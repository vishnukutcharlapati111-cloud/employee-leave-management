import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
    baseURL: '/api',
});

// Add token to requests if available
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default API;

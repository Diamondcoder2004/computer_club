// src/services/apiClient.js

import axios from 'axios';

const apiClient = axios.create({
    //baseURL: 'http://192.168.0.112:3001',
    //baseURL: 'https://curseproject-6.onrender.com',
    baseURL: 'https://mobile-app-server-3.onrender.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },

    withCredentials: true, // <-- ВАЖНО!
});

export default apiClient;
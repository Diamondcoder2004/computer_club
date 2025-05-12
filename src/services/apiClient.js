// src/services/apiClient.js

import axios from 'axios';

const apiClient = axios.create({
   baseURL: 'http://localhost:3001',
    //baseURL: 'https://curseproject-6.onrender.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // <-- ВАЖНО!
});

export default apiClient;
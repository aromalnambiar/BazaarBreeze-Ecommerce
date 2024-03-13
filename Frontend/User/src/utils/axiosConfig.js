// axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
 baseURL: 'https://ecommerce-2-cojb.onrender.com',
});

axiosInstance.interceptors.request.use(function (config) {
 const token = localStorage.getItem('token');
 if (token) {
    config.headers.Authorization = token;
 }
 return config;
}, function (error) {
 return Promise.reject(error);
});


export default axiosInstance;
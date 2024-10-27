import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;

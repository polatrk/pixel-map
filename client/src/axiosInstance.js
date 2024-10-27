import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `https://${process.env.SERVER_URL}`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;

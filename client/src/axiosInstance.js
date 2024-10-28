import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken')
    if(token)
        config.headers.Authorization = `Bearer ${token}`

    return config
})

export default axiosInstance;

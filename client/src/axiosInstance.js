import axios from 'axios';
import notify from './utils/Notification';

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

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            return axiosInstance.post('/auth/refresh')
                .then((response) => {
                    const newAccessToken = response.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                })
                .catch((err) => {
                    if (err.response && err.response.status === 401) {
                        notify("warn", "Please log in again");
                        localStorage.removeItem('accessToken');
                        window.dispatchEvent(new Event('userStatusChange'));
                    }
                    return Promise.reject(err);
                });
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;

import axiosInstance from "../axiosInstance";

export const logout = async (e) => {
    e.preventDefault()
    
    try {
        await axiosInstance.post('/auth/logout');
        localStorage.removeItem('accessToken')
        window.dispatchEvent(new Event('userStatusChange'));
        return null;
    } catch (err) {
        if (err.response?.data?.message) {
            return err.response.data.message;
        }
        return "An unknown error occurred";
    }
}

export const login = async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    const data = {
        email: email,
        password: password
    };

    try {
        const response = await axiosInstance.post('/auth/login', data);
        localStorage.setItem('accessToken', response.data.accessToken);
        window.dispatchEvent(new Event('userStatusChange'));
        return null;
    } catch (err) {
        if (err.response?.data?.message) {
            return {status: err, message: err.response.data.message};
        }
        return "An unknown error occurred";
    }
};


export const signup = async (e) => {
    e.preventDefault()

    const username = document.getElementById('usernameInput').value
    const email = document.getElementById('emailInput').value
    const password = document.getElementById('passwordInput').value

    const data = {
        username: username,
        email: email,
        password: password
    }
    
    try {
        await axiosInstance.post('/auth/signup', data);
        return null;
    } catch (err) {
        if (err.response?.data?.message) {
            return err.response.data.message;
        }
        return "An unknown error occurred";
    }
}

export const verifyEmail = async () => {
    const queryParameters = new URLSearchParams(window.location.search)
    const verifyToken = queryParameters.get("token")
    
    try {
        await axiosInstance.post('/auth/verify', {
            token: verifyToken
        });
        return null
    } catch (err) {
        if (err.response?.data?.message) {
            return err.response.data.message;
        }
        return "An unknown error occurred";
    }
}
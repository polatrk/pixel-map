import axiosInstance from "../axiosInstance";

export const logout = () => {
    axiosInstance.post('/auth/logout')
    .then((response) => {
        localStorage.removeItem('accessToken')
        window.dispatchEvent(new Event('userStatusChange'));
    })
    .catch((err) => {
      return err
    })

    return true
}

export const login = (e) => {
    const email = document.getElementById('emailInput').value
    const password = document.getElementById('passwordInput').value

    e.preventDefault()
    const data = {
        _email: email,
        _password: password
    }
    
    axiosInstance.post('/auth/login', data)
    .then((response) => {
        localStorage.setItem('accessToken', response.data.accessToken)
        window.dispatchEvent(new Event('userStatusChange'));
    })
    .catch((err) => {
        return err
    })
    return true
}

export const signup = (e) => {
    const username = document.getElementById('usernameInput').value
    const email = document.getElementById('emailInput').value
    const password = document.getElementById('passwordInput').value

    e.preventDefault()
    const data = {
        _username: username,
        _email: email,
        _password: password
    }
    
    axiosInstance.post('/auth/signup', data)
    .then((response) => {
      })
    .catch((err) => {
      return err
    })
    return true
}
import React from 'react'
import axiosInstance from '../axiosInstance'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

    const login = (e) => {
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
            navigate('/')
          })
        .catch((err) => {
          console.log("Error:", err)
        })
    }

  return (
    <>
        <h1>Login</h1>
        <form>
            <div className='form-group'>
                <label for='emailInput'>Email:</label>
                <input type='email' className='form-control' id='emailInput' placeholder='user@example.com'/>
                <label for='passwordInput'>Password:</label>
                <input type='password' className='form-control' id='passwordInput' placeholder='Your password'/>
            </div>
            <button className='btn btn-primary' onClick={login}>Login</button>
        </form>
    </>
  )
}

export default Login
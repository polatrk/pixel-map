import { useEffect, useState } from 'react'
import { GetUserInfos } from '../../utils/UserInfos'
import '../../css/Header.css'
import axiosInstance from '../../axiosInstance'

const Header = ({toggleLoginModal, toggleSignupModal}) => {
    const [isLogged, setIsLogged] = useState()

    useEffect(() => {
        setIsLogged(GetUserInfos().isLogged);

        const updateLoginState = () => {
            setIsLogged(GetUserInfos().isLogged);
        };

        window.addEventListener('userStatusChange', updateLoginState);
    }, [])

    const logout = () => {
        axiosInstance.post('/auth/logout')
        .then((response) => {
            localStorage.removeItem('accessToken')
            window.dispatchEvent(new Event('userStatusChange'));
          })
        .catch((err) => {
          if(err.response)
            alert("Error: " + err.response.data.error);
          else
            console.log(err)
        })
    }

  return (
    <div className='header-container top-right'>
        {isLogged ? (
            <>
                {/* <button type='button' className='btn btn-dark' onClick={() => navigate('/profile')}>Profile</button> */}
                <button type='button' className='btn btn-dark' onClick={logout}>Logout</button>
            </>
        ) : (
            <>
                <button type='button' className='btn btn-dark' onClick={toggleLoginModal}>Login</button>
                <button type='button' className='btn btn-dark' onClick={toggleSignupModal}>Signup</button>
            </>
        )}
    </div>
  )
}

export default Header
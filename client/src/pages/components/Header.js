import { useEffect, useState } from 'react'
import { GetUserInfos } from '../../utils/UserInfos'
import '../../css/Header.css'
import { logout } from '../../utils/AuthUtils'
import notify from '../../utils/Notification'

const Header = ({toggleLoginModal, toggleSignupModal, toggleProfileModal}) => {
    const [isLogged, setIsLogged] = useState()

    useEffect(() => {
        setIsLogged(GetUserInfos().isLogged);

        const updateLoginState = () => {
            setIsLogged(GetUserInfos().isLogged);
        };

        window.addEventListener('userStatusChange', updateLoginState);
    }, [])

    const tryLogout = async (e) => {
      e.preventDefault()
  
      const logoutError = await logout(e)
  
      if(logoutError) {
        notify("error", logoutError)
        return
      }
    }

  return (
    <div className='header-container top right'>
        {isLogged ? (
            <>
                <button type='button' className='btn btn-dark' onClick={toggleProfileModal}>Profile</button>
                <button type='button' className='btn btn-dark' onClick={tryLogout}>Logout</button>
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
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const isLogged = false
    const navigate = useNavigate()

    const logout = () => {}

  return (
    <div className='header-container top-right'>
        {isLogged ? (
            <>
                <button type='button' className='btn btn-dark' onClick={() => navigate('/profile')}>Profile</button>
                <button type='button' className='btn btn-dark' onClick={logout}>Logout</button>
            </>
        ) : (
            <>
                <button type='button' className='btn btn-dark' onClick={() => navigate('/login')}>Login</button>
                <button type='button' className='btn btn-dark' onClick={() => navigate('/signup')}>Signup</button>
            </>
        )}
    </div>
  )
}

export default Header
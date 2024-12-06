import "../../../css/Modal.css"
import "../../../css/Global.css"
import { login } from '../../../utils/AuthUtils'
import Modal from './Modal'
import notify from "../../../utils/Notification"
import { Link } from "react-router-dom"
import { useState } from "react"

const Login = ({ isModalOpen, toggleLoginModal, toggleSignupModal }) => {
  const [isLoading, setIsLoading] = useState(false)

  const tryLogin = async (e) => {
    e.preventDefault()
    
    setIsLoading(true)

    const loginError = await login(e)

    setIsLoading(false)

    if(loginError) {
      notify("error", loginError)
      return
    }

      toggleLoginModal()
  }

  return (
    <Modal id='login-modal' open={isModalOpen} toggleModal={toggleLoginModal} isLoading={isLoading}>
        <h1>LOGIN</h1>
      <form>
        <div className='form-group'>
          <label htmlFor='emailInput'>Email:</label>
          <input required type='email' name="email" className='form-control' id='emailInput' placeholder='user@example.com'/>
          <label htmlFor='passwordInput'>Password:</label>
          <input required type='password' className='form-control' id='passwordInput' placeholder='Your password'/>
        </div>
        <div className="btn-submit_container">
          <button type='submit' className='btn btn-primary' onClick={tryLogin}>Login</button>
        </div>
      </form>
      <p style={{margin: 0}}>Don't have an account ?</p>
      <Link style={{marginBottom: '2vh'}} onClick={toggleSignupModal}>Signup here.</Link>        
    </Modal>
  )
}

export default Login
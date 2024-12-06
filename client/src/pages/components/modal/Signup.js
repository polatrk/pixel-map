import { Link } from "react-router-dom"
import "../../../css/Modal.css"
import { signup } from '../../../utils/AuthUtils'
import notify from "../../../utils/Notification"
import Modal from './Modal'
import { useState } from "react"

const Signup = ({ isModalOpen, toggleSignupModal, toggleLoginModal}) => {
  const [isLoading, setIsLoading] = useState(false)

    const trySignup = async (e) => {
      e.preventDefault()
  
      setIsLoading(true)

      const signupError = await signup(e)
  
      setIsLoading(false)

      if(signupError) {
        notify('error', signupError)
        return
      }
  
      notify('success', "Verification email sent. Please check your mailbox.")

      toggleSignupModal()
    }

  return (
    <Modal open={isModalOpen} toggleModal={toggleSignupModal} isLoading={isLoading}>
        <h1>SIGNUP</h1>
      <form>
        <div className='form-group'>
          <label htmlFor='emailInput'>Email:</label>
          <input required type='email' autocomplete='username' className='form-control' id='emailInput' placeholder='user@example.com'/>
          <label htmlFor='usernameInput'>Username:</label>
          <input required type='username' autocomplete='none' className='form-control' id='usernameInput' placeholder='Username'/>
          <label htmlFor='passwordInput'>Password:</label>
          <input required type='password' autocomplete='current-password' className='form-control' id='passwordInput' placeholder='Your password'/>
        </div>
        <div className="btn-submit_container">
          <button type='submit' className='btn btn-primary' onClick={trySignup}>Signup</button>
        </div>
      </form>
      <p style={{margin: 0}}>Already have an acccount ?</p>
      <Link style={{marginBottom: '2vh'}} onClick={toggleLoginModal}>Login here.</Link>  
    </Modal>
  )
}

export default Signup
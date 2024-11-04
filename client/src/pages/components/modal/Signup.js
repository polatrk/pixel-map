import "../../../css/Modal.css"
import { signup } from '../../../utils/AuthUtils'
import Modal from './Modal'

const Signup = ({ isModalOpen, toggleSignupModal}) => {
    const trySignup = async (e) => {
      e.preventDefault()
  
      const signupError = await signup(e)
  
      if(signupError) {
        alert(signupError)
        return
      }
  
      toggleSignupModal()
    }

  return (
    <Modal open={isModalOpen} toggleModal={toggleSignupModal}>
        <h1>SIGNUP</h1>
      <form>
        <div className='form-group'>
          <label htmlFor='usernameInput'>Username:</label>
          <input required type='email' className='form-control' id='usernameInput' placeholder='Username'/>
          <label htmlFor='emailInput'>Email:</label>
          <input required type='email' className='form-control' id='emailInput' placeholder='user@example.com'/>
          <label htmlFor='passwordInput'>Password:</label>
          <input required type='password' className='form-control' id='passwordInput' placeholder='Your password'/>
        </div>
      </form>
      <button id='btn-submit' className='btn btn-primary' onClick={trySignup}>Signup</button>
    </Modal>
  )
}

export default Signup
import "../../../css/Modal.css"
import { login } from '../../../utils/AuthUtils'
import Modal from './Modal'

const Login = ({ isModalOpen, toggleLoginModal }) => {
  const tryLogin = async (e) => {
    e.preventDefault()

    const loginError = await login(e)

    if(loginError) {
      alert("email or password invalid")
      return
    }

      toggleLoginModal()
  }

  return (
    <Modal open={isModalOpen} toggleModal={toggleLoginModal}>
        <h1>LOGIN</h1>
      <form>
        <div className='form-group'>
          <label htmlFor='emailInput'>Email:</label>
          <input required type='email' className='form-control' id='emailInput' placeholder='user@example.com'/>
          <label htmlFor='passwordInput'>Password:</label>
          <input required type='password' className='form-control' id='passwordInput' placeholder='Your password'/>
        </div>
      </form>
      <button id='btn-submit' className='btn btn-primary' onClick={tryLogin}>Login</button>
    </Modal>
  )
}

export default Login
import "../../../css/Modal.css"
import { login } from '../../../utils/AuthUtils'
import Modal from './Modal'

const Login = ({ isModalOpen, toggleLoginModal }) => {
    const tryLogin = (e) => {
      const loginResult = login(e)

        if(loginResult === true)
          toggleLoginModal()
        else {
          if(loginResult.response)
            alert("Error: " + loginResult.response.data.error);
          else
            console.log(loginResult)
        }
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
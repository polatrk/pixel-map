import axiosInstance from '../../../axiosInstance'
import "../../../css/Modal.css"
import Modal from './Modal'

const Login = ({ isModalOpen, toggleLoginModal }) => {
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
            toggleLoginModal()
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
      <button id='btn-submit' className='btn btn-primary' onClick={login}>Login</button>
    </Modal>
  )
}

export default Login
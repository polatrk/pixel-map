import axiosInstance from '../../../axiosInstance'
import "../../../css/Modal.css"
import Modal from './Modal'

const Signup = ({ isModalOpen, toggleSignupModal, toggleLoginModal}) => {

    const signup = (e) => {
        const username = document.getElementById('usernameInput').value
        const email = document.getElementById('emailInput').value
        const password = document.getElementById('passwordInput').value

        e.preventDefault()
        const data = {
            _username: username,
            _email: email,
            _password: password
        }
        
        axiosInstance.post('/auth/signup', data)
        .then((response) => {
            toggleSignupModal()
            toggleLoginModal()
          })
        .catch((err) => {
          if(err.response)
            alert("Error: " + err.response.data.error);
          else
            console.log(err)
        })
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
      <button id='btn-submit' className='btn btn-primary' onClick={signup}>Signup</button>
    </Modal>
  )
}

export default Signup
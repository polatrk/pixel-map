import axiosInstance from "../../../axiosInstance"
import "../../../css/Modal.css"
import { logout } from '../../../utils/AuthUtils'
import { GetUserInfos } from "../../../utils/UserInfos"
import Modal from './Modal'

const Profile = ({ isModalOpen, toggleProfileModal }) => {
    const userInfos = GetUserInfos()

    const trySave = (e) => {
      e.preventDefault()

      const username = document.getElementById('usernameInput').value
      const email = document.getElementById('emailInput').value
      const password = document.getElementById('passwordInput').value
      

      const data = {
          username: username,
          password: password
      }

      return axiosInstance.post(`/users/${userInfos.id}`, data)
      .then((response) => {
          alert("Profile saved successfully\nPlease login again")
          logout()
      })
      .catch((err) => {
          alert("error while saving profile:", err.message)
      });
    }

  return (
    <Modal open={isModalOpen} toggleModal={toggleProfileModal}>
        <h1>PROFILE</h1>
      <form>
        <div className='form-group'>
          <label htmlFor='usernameInput'>Username:</label>
          <input required autoComplete='new-password' type='text' className='form-control' 
          id='usernameInput' placeholder='You username' defaultValue={userInfos.username} />

          <label htmlFor='emailInput'>Email:</label>
          <input required autoComplete='new-password' type='email' className='form-control' 
          id='emailInput' placeholder={userInfos.email}  defaultValue={userInfos.email} disabled/>

          <label htmlFor='passwordInput'>Password:</label>
          <input required autoComplete='new-password' type='password' className='form-control' 
          id='passwordInput' placeholder='Your password' />
        </div>
      </form>
      <button id='btn-submit' className='btn btn-primary' onClick={trySave}>Save</button>
    </Modal>
  )
}

export default Profile
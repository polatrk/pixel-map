import axiosInstance from "../../../axiosInstance"
import "../../../css/Modal.css"
import { logout } from '../../../utils/AuthUtils'
import { GetUserInfos } from "../../../utils/UserInfos"
import Modal from './Modal'
import notify from "../../../utils/Notification"
import { t } from "i18next"
import { useState } from "react"

const Profile = ({ isModalOpen, toggleProfileModal }) => {
    const userInfos = GetUserInfos()
    const [isLoading, setIsLoading] = useState(false)

    const trySave = (e) => {
      e.preventDefault()

      const username = document.getElementById('usernameInput').value
      //const email = document.getElementById('emailInput').value
      const password = document.getElementById('passwordInput').value
      

      const data = {
          username: username,
          password: password
      }

      return axiosInstance.post(`/users/${userInfos.id}`, data)
      .then((response) => {
        toggleProfileModal()
        notify("success", t('Profile saved successfully\nPlease login again'))
        logout()
      })
      .catch((err) => {
        notify("error", `${t('error while saving profile')}: ${err.message}`)
      });
    }

  return (
    <Modal open={isModalOpen} toggleModal={toggleProfileModal}>
        <h1>{t('PROFILE')}</h1>
      <form>
        <div className='form-group'>
          <label htmlFor='usernameInput'>{t('Username')}:</label>
          <input required autoComplete='new-password' type='text' className='form-control' 
          id='usernameInput' placeholder='You username' defaultValue={userInfos.username} />

          <label htmlFor='emailInput'>Email:</label>
          <input required autoComplete='new-password' type='email' className='form-control' 
          id='emailInput' placeholder={userInfos.email}  defaultValue={userInfos.email} disabled/>

          <label htmlFor='passwordInput'>{t('Password')}:</label>
          <input required autoComplete='new-password' type='password' className='form-control' 
          id='passwordInput' placeholder={t('Your password')} />
        </div>
        <div className="btn-submit_container" style={{marginBottom: '1vh'}}>
          <button type='submit' className='btn btn-primary' onClick={trySave}>{t('Save')}</button>
        </div>
      </form>
    </Modal>
  )
}

export default Profile
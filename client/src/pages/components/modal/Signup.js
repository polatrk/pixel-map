import { Link } from "react-router-dom"
import "../../../css/Modal.css"
import "../../../css/Global.css"
import { signup } from '../../../utils/AuthUtils'
import notify from "../../../utils/Notification"
import Modal from './Modal'
import { useState } from "react"
import { t } from "i18next"

const Signup = ({ isModalOpen, toggleSignupModal, toggleLoginModal}) => {
  const [isLoading, setIsLoading] = useState(false)

    const trySignup = async (e) => {
      e.preventDefault()
  
      setIsLoading(true)

      const signupError = await signup(e)
  
      setIsLoading(false)

      if(signupError)
        if(signupError.status !== 200) {
          notify("error", signupError.message)
          return
        }
  
      notify('success', t('Verification email sent. Please check your mailbox.'))

      toggleSignupModal()
    }

  return (
    <Modal open={isModalOpen} toggleModal={toggleSignupModal} isLoading={isLoading}>
        <h1>{t('SIGNUP')}</h1>
      <form>
        <div className='form-group'>
          <label htmlFor='emailInput'>Email:</label>
          <input required type='email' autocomplete='username' className='form-control' id='emailInput' placeholder='user@example.com'/>
          <label htmlFor='usernameInput'>{t('Username')}:</label>
          <input required type='username' autocomplete='none' className='form-control' id='usernameInput' placeholder={t('Username')}/>
          <label htmlFor='passwordInput'>{t('Password')}:</label>
          <input required type='password' autocomplete='current-password' className='form-control' id='passwordInput' placeholder={t('Your password')}/>
        </div>
        <div className="btn-submit_container">
          <button type='submit' className='btn btn-primary' onClick={trySignup}>{t('Signup')}</button>
        </div>
      </form>
      <p style={{margin: 0}}>{t('Already have an acccount ?')}</p>
      <Link style={{marginBottom: '2vh'}} onClick={toggleLoginModal}>{t('Login here.')}</Link>  
    </Modal>
  )
}

export default Signup
import React, { useEffect, useState } from "react"
import { verifyEmail } from "../utils/AuthUtils"

const VerifiedEmail = () => {
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const verify = async () => {
      try {
        const verifyError = await verifyEmail()

        if (verifyError) {
          setIsEmailVerified(false)
          setErrorMessage(verifyError)
          return
        }

        setIsEmailVerified(true)
      } catch (error) {
        setIsEmailVerified(false)
        setErrorMessage("An unknown error occurred.")
      }
    }

    verify()
  }, [])

  return (
    <>
      {isEmailVerified ? (
        <h1>Email verified, please login.</h1>
      ) : (
        <h1>{errorMessage}</h1>
      )}
    </>
  )
}

export default VerifiedEmail

import React, { useContext, useEffect, useState } from 'react'

import { FirebaseContext } from '../../../contexts/firebase'
import LogForm from './LogForm'

const Login = ({ isOpen, setOpenModal, children }) => {
  const { signInWithEmailAndPassword } = useContext(FirebaseContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setPassword('')
    }
  }, [isOpen])

  const onSubmit = async () => {
    signInWithEmailAndPassword(email, password)
      .then(() => setOpenModal(''))
      .catch(currentError => {
        if (
          currentError.code === 'auth/wrong-password' ||
          currentError.code === 'auth/invalid-email' ||
          currentError.code === 'auth/user-not-found'
        ) {
          setError('Combinaison login/mot de passe incorrecte')
        } else if (currentError.code === 'auth/user-disabled') {
          setError("L'utilisateur a été désactivé")
        }
      })
  }

  return (
    <LogForm
      onSubmit={onSubmit}
      setOpenModal={setOpenModal}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      setShowPassword={setShowPassword}
      showPassword={showPassword}
      error={error}
    >
      {children}
    </LogForm>
  )
}
export default Login

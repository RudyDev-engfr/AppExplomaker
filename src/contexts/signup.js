import React, { useState, useEffect, createContext } from 'react'

export const SignupContext = createContext()

const SignupContextProvider = ({ children }) => {
  const localSignup = JSON.parse(localStorage.getItem('signup'))
  const [signup, setSignup] = useState(localSignup || {})

  useEffect(() => {
    localStorage.setItem('signup', JSON.stringify(signup))
  }, [signup])

  return <SignupContext.Provider value={{ signup, setSignup }}>{children}</SignupContext.Provider>
}

export default SignupContextProvider

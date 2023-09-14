import React, { useState, useEffect, createContext, useContext } from 'react'
import { buildNotifications } from '../helper/functions'
import { FirebaseContext } from './firebase'

export const SessionContext = createContext()

const SessionContextProvider = ({ children }) => {
  const localUser = JSON.parse(localStorage.getItem('user'))
  const { firestore } = useContext(FirebaseContext)
  const [user, setUser] = useState(localUser || {})
  const [currentUserNotifications, setCurrentUserNotifications] = useState()
  const [firstname, setFirstname] = useState('')
  const [tripRoles, setTripRoles] = useState()
  const [needRedirectTo, setNeedRedirectTo] = useState()
  const [joinCallback, setJoinCallback] = useState(() => {})

  const handleNotifications = () => {
    buildNotifications(user).then(notifications => setCurrentUserNotifications(notifications))
  }

  const handleUserUpdate = data => {
    firestore
      .collection('users')
      .doc(user.id)
      .set(
        {
          ...data,
        },
        { merge: true }
      )
      .then(() => true)
  }

  useEffect(() => {
    if (user?.firstname && user?.isFirstTrip !== 'no') {
      handleUserUpdate({ isFirstTrip: 'yes' })
      console.log('user chargé et premier voyage')
    }
    if (user?.firstname && user?.isFirstTrip === 'no') {
      console.log('User chargé et pas le premier voyage', user)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      handleNotifications(user)
    }
  }, [user])

  useEffect(() => {
    console.log('le prénom', firstname)
  }, [firstname])

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
    setFirstname(user.firstname)
    if (user.isLoggedIn) {
      firestore
        .collection('users')
        .doc(user.id)
        .collection('trips')
        .get()
        .then(querySnapshot => {
          const tempTripRoles = []
          querySnapshot.forEach(doc => {
            tempTripRoles.push({ id: doc.id, data: doc.data() })
          })
          setTripRoles(tempTripRoles)
        })
    }
  }, [user])

  return (
    <SessionContext.Provider
      value={{
        user,
        setUser,
        tripRoles,
        needRedirectTo,
        setNeedRedirectTo,
        joinCallback,
        setJoinCallback,
        firstname,
        currentUserNotifications,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export default SessionContextProvider

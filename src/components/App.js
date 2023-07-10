import React, { useContext, useEffect } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Box from '@mui/material/Box'
import { useMediaQuery } from '@mui/material'
import { FirebaseContext, useAuth } from '../contexts/firebase'
import { SessionContext } from '../contexts/session'
import Routes from './Router/Routes'
import Loader from './Loader'

import beta from '../images/beta.svg'

const mapsLibraries = ['places']

const App = () => {
  const matchesXs = useMediaQuery('(max-width:600px)')
  const { setUser, user } = useContext(SessionContext)
  const { firestore, database, setLocalUsers, isDictionaryLoaded, timestampRef } =
    useContext(FirebaseContext)
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBJepvl7rY64ocX_24S1FnqYFyEHTRNBFU',
    libraries: mapsLibraries,
  })
  const { initializing, firebaseUser } = useAuth()

  useEffect(() => {
    console.log('utilisateur', user)
  }, [user])

  useEffect(() => {
    if (firebaseUser) {
      const tempUser = { isLoggedIn: true, id: firebaseUser.uid }
      const usersRef = firestore.collection('users')

      usersRef.doc(firebaseUser.uid).onSnapshot(doc => {
        const data = doc.data()
        if (typeof data !== 'undefined') {
          tempUser.gender = data.gender
          tempUser.firstname = data.firstname
          tempUser.lastname = data.lastname
          tempUser.birthdate = data.birthdate
          tempUser.email = data.email
          tempUser.avatar = data.avatar
          tempUser.type = data.type
          tempUser.rangeType = data.rangeType
          tempUser.likes = data.likes
          tempUser.newsletter = data.newsletter
          tempUser.myTripLetter = data.myTripLetter || 'weekly'
          tempUser.notifications = data.notifications || []
          setUser({ ...tempUser })
        }
      })

      database.ref('.info/connected').on('value', () => {
        database
          .ref(`/status/${firebaseUser.uid}`)
          .onDisconnect() // Set up the disconnect hook
          .set('offline') // The value to be set for this key when the client disconnects
          .then(() => {
            // Set the Firestore User's online status to true
            usersRef.doc(firebaseUser.uid).set(
              {
                online: true,
                lastSeenAt: new timestampRef.fromDate(new Date()),
              },
              { merge: true }
            )

            // Let's also create a key in our real-time database
            database.ref(`/status/${firebaseUser.uid}`).set('online')
          })
      })
    } else if (!initializing) {
      setLocalUsers([])
      setUser({ isLoggedIn: false })
    }
  }, [firebaseUser, initializing])

  if (isLoaded && isDictionaryLoaded) {
    return (
      <>
        <Box
          component="img"
          src={beta}
          alt="beta-banner"
          sx={{
            width: '75px',
            position: 'fixed',
            top: '-15px',
            left: '-15px',
            zIndex: '999',
            pointerEvents: 'none',
            opacity: '0.6',
          }}
        />
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
        <ToastContainer
          position={matchesXs ? 'top-center' : 'bottom-right'}
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </>
    )
  }
  return loadError ? <h2>{loadError}</h2> : <Loader />
}

export default App

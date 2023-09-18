/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, createContext, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { FirebaseContext } from './firebase'
import { SessionContext } from './session'

export const NewTripContext = createContext()

const CURRENT_VERSION = 1 // mettez à jour cette valeur à chaque modification importante

const initialValues = {
  version: CURRENT_VERSION,
  destination: '',
  latitude: 46.2276,
  longitude: 2.2137,
  dateRange: ['', ''],
  title: 'Nouveau séjour',
  description: '',
  context: '',
  budget: '',
  wishes: [],
  travelersDetails: [],
  nbTravelers: 0,
  noDestination: true,
  premium: false,
}

const NewTripContextProvider = ({ children }) => {
  const localNewTrip = JSON.parse(localStorage.getItem('newTrip'))
  const history = useHistory()
  const { firestore, timestampRef, dictionary, createNotifications } = useContext(FirebaseContext)
  const { user, setUser } = useContext(SessionContext)
  // Vérifiez si la version du localNewTrip est différente de la version actuelle
  const isVersionMismatched = !localNewTrip.version || localNewTrip.version !== CURRENT_VERSION
  // Si la version ne correspond pas, utilisez initialValues, sinon utilisez localNewTrip
  const initialState = isVersionMismatched ? initialValues : localNewTrip
  if (isVersionMismatched) {
    // Mettez à jour le localStorage si nécessaire
    localStorage.setItem('newTrip', JSON.stringify(initialValues))
  }

  // Initialisez votre état avec initialState
  const [newTrip, setNewTrip] = useState(initialState)
  const [currentSpot, setCurrentSpot] = useState()
  const [hasClicked, setHasClicked] = useState(false)

  useEffect(() => {
    localStorage.setItem('newTrip', JSON.stringify(newTrip))
    console.log('newtrip', newTrip)
  }, [newTrip])

  const cleanupNewTrip = () => {
    setNewTrip({ ...initialValues })
  }

  useEffect(() => {
    const tempProperties = {}
    for (const property in initialValues) {
      if (typeof newTrip[property] === 'undefined') {
        tempProperties[property] = initialValues[property]
      } else {
        tempProperties[property] = newTrip[property]
      }
    }
    for (const property in newTrip) {
      if (typeof initialValues[property] === 'undefined') {
        delete tempProperties[property]
      }
    }
    setNewTrip({ ...tempProperties })
  }, [])

  useEffect(() => {
    if (user.isLoggedIn) {
      const tempProperties = {}
      for (const property in initialValues) {
        if (typeof newTrip[property] === 'undefined') {
          tempProperties[property] = initialValues[property]
        } else {
          tempProperties[property] = newTrip[property]
        }
      }
      if (newTrip.travelersDetails.length < 1 || newTrip.travelersDetails[0].id !== user.id) {
        tempProperties.travelersDetails = [
          { name: user.firstname, age: 'adult', id: user.id, tempId: uuidv4() },
          // { name: '', age: 'adult', tempId: uuidv4() },
        ]
        tempProperties.nbTravelers = 1
      }
      for (const property in newTrip) {
        if (typeof initialValues[property] === 'undefined') {
          delete tempProperties[property]
        }
      }
      setNewTrip({ ...tempProperties })
    } else {
      cleanupNewTrip()
    }
  }, [user])

  const handleTripCreation = () => {
    setHasClicked(true)
    const tempTravelers = newTrip.travelersDetails.map(traveler => {
      const { name, age, id, travelerId } = traveler
      if (id) {
        return { name: user?.firstname, age, id }
      }
      return { name, age, travelerId }
    })

    const tempDestination = newTrip.noDestination
      ? { noDestination: true, destination: null }
      : {
          destination: {
            ...newTrip.destination,
            ...(newTrip.destination.shortCountryName
              ? {
                  label: newTrip.destination.label,
                  place_id: newTrip.destination.value?.place_id,
                  shortCountryName: newTrip.destination.shortCountryName,
                }
              : {
                  label: newTrip.destination.label,
                  place_id: newTrip.destination.value?.place_id,
                }),
          },
        }

    const tempWishes = newTrip.wishes
    delete newTrip.wishes

    let tempMainPicture = ''
    if (currentSpot?.picture_slider?.length > 0) {
      tempMainPicture = currentSpot.picture_slider[0].src.original
    }
    const tempTrip = {
      ...newTrip,
      travelersDetails: tempTravelers,
      ...tempDestination,
      owner: user.id,
      editors: [user.id],
      currency: 'eur',
      createdAt: new timestampRef.fromDate(new Date()),
      title: newTrip.title.trim(),
      mainPicture: tempMainPicture,
    }

    firestore
      .collection('trips')
      .add({
        ...newTrip,
        travelersDetails: tempTravelers,
        ...tempDestination,
        owner: user.id,
        editors: [user.id],
        currency: 'eur',
        createdAt: new timestampRef.fromDate(new Date()),
        title: newTrip.title.trim(),
        mainPicture: tempMainPicture,
      })
      .then(docRef => {
        cleanupNewTrip()
        setUser({ ...user, lastCreatedTripId: docRef.id })
        const batch = firestore.batch()
        batch.set(firestore.collection('users').doc(user.id).collection('trips').doc(docRef.id), {
          role: 'owner',
        })
        tempWishes.forEach(wish => {
          batch.set(
            firestore.collection('trips').doc(docRef.id).collection('wishes').doc(uuidv4()),
            {
              ...wish,
              userId: user.id,
            }
          )
        })
        batch.commit()
        console.log('utilisateur', user)
        console.log('nouveauvoyage', newTrip)
        // createNotifications(user, tempTrip, docRef.id, 'newTrip', 3)
        window.location.href = `/tripPage/${docRef.id}`
      })
  }

  return (
    <NewTripContext.Provider
      value={{
        newTrip,
        setNewTrip,
        cleanupNewTrip,
        currentSpot,
        setCurrentSpot,
        handleTripCreation,
        hasClicked,
        setHasClicked,
      }}
    >
      {children}
    </NewTripContext.Provider>
  )
}

export default NewTripContextProvider

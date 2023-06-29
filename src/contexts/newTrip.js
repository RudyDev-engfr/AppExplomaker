/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, createContext, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { SessionContext } from './session'

export const NewTripContext = createContext()

const initialValues = {
  destination: '',
  latitude: 46.2276,
  longitude: 2.2137,
  dateRange: ['', ''],
  title: '',
  description: '',
  context: '',
  budget: '',
  wishes: [],
  travelersDetails: [],
  nbTravelers: 0,
  noDestination: false,
  premium: true,
}

const NewTripContextProvider = ({ children }) => {
  const localNewTrip = JSON.parse(localStorage.getItem('newTrip'))
  const { user } = useContext(SessionContext)
  const [newTrip, setNewTrip] = useState(localNewTrip || { ...initialValues })
  const [currentSpot, setCurrentSpot] = useState()

  useEffect(() => {
    localStorage.setItem('newTrip', JSON.stringify(newTrip))
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
          { name: '', age: 'adult', tempId: uuidv4() },
        ]
        tempProperties.nbTravelers = 2
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

  return (
    <NewTripContext.Provider
      value={{
        newTrip,
        setNewTrip,
        cleanupNewTrip,
        currentSpot,
        setCurrentSpot,
      }}
    >
      {children}
    </NewTripContext.Provider>
  )
}

export default NewTripContextProvider

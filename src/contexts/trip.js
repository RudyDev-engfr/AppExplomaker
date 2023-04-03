import React, { useState, useEffect, createContext, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FirebaseContext } from './firebase'
import { SessionContext } from './session'

export const TripContext = createContext()

const TripContextProvider = ({ children }) => {
  const { delNotificationsFromAnEventDeleted, refreshTripData, createNotificationsOnTrip } =
    useContext(FirebaseContext)
  const { user } = useContext(SessionContext)
  const { tripId } = useParams()
  const [deleteEventNotifications, setDeleteEventNotifications] = useState(false)
  const [tripData, setTripData] = useState()
  const [currentEvent, setCurrentEvent] = useState()
  const [allowDeleteNotif, setAllowDeleteNotif] = useState(false)

  useEffect(() => {
    console.log(deleteEventNotifications, 'si cest true je peux supprimer')
  }, [deleteEventNotifications])

  useEffect(() => {
    if (deleteEventNotifications) {
      console.log('je suis rentré là')

      delNotificationsFromAnEventDeleted(tripData, tripId, currentEvent)
      refreshTripData(tripId, setTripData)
      setDeleteEventNotifications(false)
      setTimeout(() => {
        setAllowDeleteNotif(true)
      }, 2000)
    }
  }, [deleteEventNotifications])

  const handleCreateDeleteNotif = () => {
    createNotificationsOnTrip(user, tripData, tripId, 'eventDelete', 2, currentEvent)
    setTimeout(() => {
      setCurrentEvent()
    }, 2000)
    toast.success('Evenement supprime')
  }

  useEffect(() => {
    if (allowDeleteNotif) {
      handleCreateDeleteNotif()
    }
  }, [allowDeleteNotif])

  useEffect(() => {
    console.log('tripData du useEffect planning', tripData)
  }, [tripData])

  return (
    <TripContext.Provider
      value={{
        deleteEventNotifications,
        setDeleteEventNotifications,
        currentEvent,
        setCurrentEvent,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}
export default TripContextProvider

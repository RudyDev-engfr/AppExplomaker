import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Loader from '../components/Loader'

const WelcomeTrip = () => {
  const { tripId } = useParams()
  const history = useHistory()

  setTimeout(() => {
    history.push(`/tripPage/${tripId}`)
  }, 3000)

  return <Loader joinTrip />
}
export default WelcomeTrip

import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Loader from '../components/Loader'

const WelcomeTrip = () => {
  const { tripid } = useParams()
  const history = useHistory()

  setTimeout(() => {
    history.push(`/tripPage/${tripid}`)
  }, 5000)

  return <Loader joinTrip />
}
export default WelcomeTrip

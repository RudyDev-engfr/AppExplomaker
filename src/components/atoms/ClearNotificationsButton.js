import React, { useContext } from 'react'
import { Check } from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import { useTheme } from '@mui/styles'
import { useMediaQuery } from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { SessionContext } from '../../contexts/session'
import { FirebaseContext } from '../../contexts/firebase'

const ClearNotificationsButton = ({ currentNotifications }) => {
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useContext(SessionContext)
  const { setNotificationsToNewStateOnTrip } = useContext(FirebaseContext)
  const { tripId } = useParams()

  return (
    <Button
      onClick={() => {
        if (currentNotifications.filter(notification => notification.state !== 3).length > 0) {
          setNotificationsToNewStateOnTrip(user, tripId, 3)
        }
      }}
      endIcon={<Check />}
      variant="contained"
      sx={{
        borderRadius: '20px',
        position: 'absolute',
        bottom: matchesXs ? '90px' : '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        textTransform: 'none',
        width: '280px',
      }}
    >
      <Typography>Marquer toutes comme lues</Typography>
    </Button>
  )
}
export default ClearNotificationsButton

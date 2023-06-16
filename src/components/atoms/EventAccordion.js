import React from 'react'
import Launch from '@mui/icons-material/Launch'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/styles'
import { useHistory } from 'react-router-dom'
import { isSameDay } from 'date-fns'
import { stringToDate } from '../../helper/functions'

const EventAccordion = ({ notification, days, setSelectedDateOnPlanning, setCurrentView }) => {
  const theme = useTheme()
  const history = useHistory()

  const setRefreshActiveDate = singleNotification => {
    days.forEach(day => {
      if (isSameDay(stringToDate(notification.startTime, 'yyyy-MM-dd HH:mm'), day)) {
        setSelectedDateOnPlanning(day)
        console.log('wtf')
      }
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography>Lieu : {notification.logs.place}</Typography>
        <Typography>Date : {notification.logs.date}</Typography>
        <Typography>Nom : {notification.logs.eventName}</Typography>
        <Typography>
          participants :
          {notification.logs.participatingTravelers.map(participant => ` ${participant},`)}
        </Typography>
      </Box>
      <IconButton
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
          },
        }}
        onClick={() => {
          if (notification?.eventType) {
            setRefreshActiveDate(notification)
          }
          history.push(notification.url)
        }}
      >
        <Launch />
      </IconButton>
    </Box>
  )
}

export default EventAccordion

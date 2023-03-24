import React from 'react'
import { Launch } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useHistory } from 'react-router-dom'

const EventAccordion = ({ notification }) => {
  const theme = useTheme()
  const history = useHistory()

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
        onClick={() => history.push(notification.url)}
      >
        <Launch />
      </IconButton>
    </Box>
  )
}

export default EventAccordion

import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { useHistory } from 'react-router-dom'
import { Launch } from '@mui/icons-material'

const DateUpdateAccordion = ({ notification }) => {
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
        <Typography>
          Ancienne date :{' '}
          <Typography component="span" sx={{ fontWeight: 700 }}>
            {notification.logs.oldDate}
          </Typography>
        </Typography>
        <Typography>
          Nouvelle date :{' '}
          <Typography component="span" sx={{ fontWeight: 700 }}>
            {notification.logs.newDate}
          </Typography>
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
export default DateUpdateAccordion

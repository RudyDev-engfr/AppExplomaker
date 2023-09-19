import React, { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'

import { NewTripContext } from '../contexts/newTrip'
import { SessionContext } from '../contexts/session'

function CreateTrip() {
  const theme = useTheme()
  const { user } = useContext(SessionContext)
  const location = useLocation()
  const { handleTripCreation } = useContext(NewTripContext)
  useEffect(() => {
    handleTripCreation()
  }, [location])

  // Peut afficher une sorte de spinner ou de feedback pendant la création du voyage
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        width: '100vw',
        height: '100vh',
      }}
    >
      <Box
        sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <Typography
          color="secondary.contrastText"
          sx={{ fontSize: '54px', lineHeight: '64px', fontWeight: 700 }}
        >
          Bienvenue
        </Typography>
        {user?.firstname && (
          <Typography
            color="secondary.contrastText"
            sx={{ fontSize: '54px', lineHeight: '64px', fontWeight: 700 }}
          >
            {user.firstname} 🎉
          </Typography>
        )}
      </Box>
    </Box>
  )
}
export default CreateTrip

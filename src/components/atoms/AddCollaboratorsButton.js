import React from 'react'
import { IconButton } from '@mui/material'
import { toast } from 'react-toastify'
import { Add } from '@mui/icons-material'
import { useTheme } from '@mui/styles'

const AddCollaboratorsButton = ({ tripId }) => {
  const theme = useTheme()
  return (
    <IconButton
      onClick={() => {
        navigator.clipboard.writeText(
          `https://${window.location.href.split('/')[2]}/join/${tripId}`
        )
        toast.success('Lien copié !')
      }}
      sx={{
        backgroundColor: theme.palette.primary.main,
        borderRadius: ' 50px',
        width: '48px',
        height: '48px',
        marginRight: '-10px',
        zIndex: 1000,
      }}
    >
      <Add sx={{ color: 'white', fontSize: '30px' }} />
    </IconButton>
  )
}

export default AddCollaboratorsButton

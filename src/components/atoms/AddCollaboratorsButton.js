import React from 'react'
import { useTheme } from '@mui/styles'
import { IconButton } from '@mui/material'
import { toast } from 'react-toastify'
import { PersonAddAlt1 } from '@mui/icons-material'

const AddCollaboratorsButton = ({
  tripId,
  size = '44px',
  iconSize = '26px',
  isEditorModal = false,
}) => {
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
        width: size,
        height: size,
        marginRight: !isEditorModal && '-10px',
        zIndex: 1000,
        '&:hover': {
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        },
        border: '2px solid white',
      }}
    >
      <PersonAddAlt1 sx={{ color: 'white', fontSize: iconSize }} />
    </IconButton>
  )
}

export default AddCollaboratorsButton

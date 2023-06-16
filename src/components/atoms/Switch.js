import React, { useContext } from 'react'
import MuiSwitch from '@mui/material/Switch'
import useTheme from '@mui/styles/useTheme'

import { SessionContext } from '../../contexts/session'
import { FirebaseContext } from '../../contexts/firebase'

// User only
const Switch = ({ target, checked }) => {
  const theme = useTheme()
  const { user } = useContext(SessionContext)
  const { firestore, timestampRef } = useContext(FirebaseContext)

  const handleUpdate = event => {
    firestore
      .collection('users')
      .doc(user.id)
      .update({
        [target]: event.target.checked,
        updatedAt: new timestampRef.fromDate(new Date()),
      })
  }

  return (
    <MuiSwitch
      checked={checked}
      onChange={handleUpdate}
      color="primary"
      sx={{
        '& .MuiSwitch-thumb': {
          backgroundColor: theme.palette.primary.contrastText,
          border: `2px solid ${checked ? theme.palette.primary.main : theme.palette.grey.bd}`,
        },
        '& .MuiSwitch-track': {
          opacity: checked ? '1!important' : '0.262',
        },
      }}
    />
  )
}

export default Switch

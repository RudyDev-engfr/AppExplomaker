import React, { useContext, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'

import { FirebaseContext } from '../../contexts/firebase'

const PwdReset = ({ setOpenModal }) => {
  const [emailReset, setEmailReset] = useState('')
  const { auth } = useContext(FirebaseContext)
  const [error, setError] = useState()

  const handlePwdReset = event => {
    event.preventDefault()
    auth
      .sendPasswordResetEmail(emailReset)
      .then(() => {
        setOpenModal('')
        toast.success('Email de changement de mot de passe envoyé', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      })
      .catch(() => {
        setError("Cet utilisateur n'existe pas")
      })
  }

  return (
    <form onSubmit={handlePwdReset}>
      <Box m={4}>
        <TextField
          id="emailReset"
          type="email"
          label="Email"
          variant="filled"
          value={emailReset}
          onChange={event => setEmailReset(event.target.value)}
          error={!!error}
          helperText={error}
          fullWidth
        />
        <Box my={2} />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={emailReset.length < 3}
          sx={{ textTransform: 'none' }}
        >
          Continuer
        </Button>
      </Box>
    </form>
  )
}

export default PwdReset

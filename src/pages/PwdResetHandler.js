import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Paper,
  Box,
  TextField,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useHistory } from 'react-router-dom'

import { FirebaseContext } from '../contexts/firebase'

import logoFull from '../images/icons/logoFull.svg'

const PwdResetHandler = () => {
  const history = useHistory()
  const { auth } = useContext(FirebaseContext)
  const [isCodeValid, setIsCodeValid] = useState(false)
  const [validCode, setValidCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [newPasswordVerif, setNewPasswordVerif] = useState('')
  const [showNewPasswordVerif, setShowNewPasswordVerif] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('oobCode')
    auth.verifyPasswordResetCode(code).then(() => {
      setIsCodeValid(true)
      setValidCode(code)
    })
  }, [])

  const handleSubmit = event => {
    event.preventDefault()
    auth.confirmPasswordReset(validCode, newPassword).then(() => {
      history.push('/')
    })
  }

  return (
    <>
      {isCodeValid ? (
        <Box
          width="100%"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="primary.main"
        >
          <Paper>
            <Box m={4}>
              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column">
                  <Box mx="auto" mb={4} width="60%">
                    <img src={logoFull} alt="explomaker logo" style={{ width: '100%' }} />
                  </Box>
                  <Typography variant="h1" component="h2">
                    Changement de mot de passe
                  </Typography>
                  <Box my={2}>
                    <TextField
                      id="password"
                      type={showNewPassword ? 'text' : 'password'}
                      label="Mot de passe"
                      variant="filled"
                      value={newPassword}
                      onChange={event => setNewPassword(event.target.value)}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              onMouseDown={() => setShowNewPassword(!showNewPassword)}
                              size="large"
                            >
                              {showNewPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <TextField
                    id="newPassword"
                    type={showNewPasswordVerif ? 'text' : 'password'}
                    label="Vérification du mot de passe"
                    variant="filled"
                    value={newPasswordVerif}
                    onChange={event => setNewPasswordVerif(event.target.value)}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowNewPasswordVerif(!showNewPasswordVerif)}
                            onMouseDown={() => setShowNewPasswordVerif(!showNewPasswordVerif)}
                            size="large"
                          >
                            {showNewPasswordVerif ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box mt={4}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={!(newPassword.length >= 6 && newPassword === newPasswordVerif)}
                    >
                      Modifier le mot de passe
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Paper>
        </Box>
      ) : (
        <Box width="100%" height="100vh" display="flex" justifyContent="center" alignItems="center">
          <Paper>
            <Box m={4}>
              <Typography variant="h1" component="h2">
                URL invalide
              </Typography>
              <Typography>Veuillez contacter un administrateur</Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </>
  )
}

export default PwdResetHandler

import React from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(theme => ({
  modalLogInButton: {
    height: '72px',
    textTransform: 'none',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '24px',
    [theme.breakpoints.down('sm')]: {
      borderRadius: '50px',
    },
  },
  invisibleButton: {
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'unset',
      color: '#008481',
    },
  },
}))

const LogForm = ({
  setOpenModal,
  setEmail,
  email,
  setPassword,
  password,
  showPassword,
  setShowPassword,
  onSubmit,
  error,
  children,
}) => {
  const handleSubmit = event => {
    event.preventDefault()
    onSubmit()
  }

  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="email"
        type="email"
        label="Email"
        variant="filled"
        value={email}
        onChange={event => setEmail(event.target.value)}
        fullWidth
      />
      <TextField
        id="password"
        type={showPassword ? 'text' : 'password'}
        label="Mot de passe"
        variant="filled"
        value={password}
        onChange={event => setPassword(event.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={!!error}
        helperText={error}
      />
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Box my={2} width="100%">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!(email !== '' && password.length > 5)}
            className={classes.modalLogInButton}
          >
            Se connecter
          </Button>
        </Box>
        <Button
          onClick={() => setOpenModal('pwdReset')}
          disableRipple
          className={classes.invisibleButton}
        >
          {matchesXs ? "J'ai oublié mon mot de passe" : 'Mot de passe oublié ?'}
        </Button>
      </Box>
      {children}
    </form>
  )
}

export default LogForm

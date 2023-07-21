import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

import { makeStyles, useTheme } from '@mui/styles'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import FemaleIcon from '@mui/icons-material/Female'
import MaleIcon from '@mui/icons-material/Male'
import DatePicker from '@mui/lab/DatePicker'
import clsx from 'clsx'

import { SignupContext } from '../../contexts/signup'
import { FirebaseContext } from '../../contexts/firebase'
import Wrapper from './Wrapper'

const useStyles = makeStyles(theme => ({
  inputGrid: {
    display: 'grid',
    gridTemplate: `1fr
                   1fr
                   / repeat(6, 1fr)`,
    gridGap: '20px',
    [theme.breakpoints.down('sm')]: {
      gridTemplate: `102px 82px 102px 102px 102px / 1fr`,
      gridGap: '0',
    },
  },
  radioGroup: {
    marginBottom: '20px',
  },
  gridItem: {
    gridColumn: 'span 2',
    [theme.breakpoints.down('sm')]: {
      gridColumn: `unset`,
    },
  },
  largeGridItem: {
    gridColumn: 'span 3',
    [theme.breakpoints.down('sm')]: {
      gridColumn: 'unset',
      marginTop: '20px',
    },
  },
  firstnameInput: {
    [theme.breakpoints.down('sm')]: {
      marginTop: '20px',
      '& .MuiInputBase-root': {
        borderRadius: '10px 10px 0 0',
      },
    },
  },
  lastnameInput: {
    [theme.breakpoints.down('sm')]: {
      '& .MuiInputBase-root': {
        borderRadius: '0 0 10px 10px',
      },
    },
  },
  birthdatePicker: {
    [theme.breakpoints.down('sm')]: {
      marginTop: '20px',
      '& .MuiInputBase-root': {
        height: '82px',
        borderRadius: '10px',
        '& input': {
          height: '82px',
        },
      },
    },
  },
  label: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(12px, 30px) scale(1)',
    },
  },
  shrinkedLabel: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(12px, 17px) scale(0.75)',
    },
  },
  genderBtn: {
    borderRadius: '10px',
    backgroundColor: theme.palette.grey.f7,
    color: theme.palette.grey['82'],
    fontSize: '14px',
    textTransform: 'unset',
    fontWeight: '400',
    padding: '6px 8px',
    maxWidth: '90px',
  },
  activeGenderBtn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}))

const SecondStep = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { auth, firestore, signInWithEmailAndPassword, timestampRef } = useContext(FirebaseContext)
  const { signup, setSignup } = useContext(SignupContext)

  const [showPassword, setShowPassword] = useState(false)
  const [birthdate, setBirthdate] = useState(new Date())
  const [error, setError] = useState()

  useEffect(() => {
    setSignup({ ...signup, birthdate })
  }, [birthdate])

  const handleSubmit = () => {
    const {
      email,
      gender,
      firstname,
      lastname,
      birthdate: currentBirthdate,
      newsletter,
      password,
      myTripLetter,
    } = signup
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async firebaseUser => {
        firestore
          .collection('users')
          .doc(firebaseUser.user.uid)
          .set({
            email,
            gender,
            firstname,
            lastname,
            birthdate: new timestampRef.fromDate(currentBirthdate),
            newsletter: newsletter || false,
            myTripLetter: myTripLetter || 'weekly',
          })
          .then(async () => {
            await signInWithEmailAndPassword(email, password)
            history.push('/signup/thirdStep')
          })
      })
      .catch(currentError => {
        if (currentError.code === 'auth/email-already-in-use') {
          setError('Addresse email déjà utilisée')
        }
      })
  }

  return (
    <Wrapper
      currentStep="1"
      title="Bienvenue à toi, cher Explorateur !"
      subtitle="Pour compléter ton inscription, nous allons avoir besoin de quelques informations complémentaires :"
      backURL="/"
      handleSubmit={handleSubmit}
    >
      <Box display="flex" flexDirection="column">
        {matchesXs ? (
          <Box display="flex" height="82px" justifyContent="space-evenly">
            <Button
              fullWidth
              variant="contained"
              disableElevation
              onClick={() => setSignup({ ...signup, gender: 'female' })}
              startIcon={<FemaleIcon />}
              className={clsx(classes.genderBtn, {
                [classes.activeGenderBtn]: signup.gender === 'female',
              })}
            >
              Madame
            </Button>
            <Button
              fullWidth
              variant="contained"
              disableElevation
              onClick={() => setSignup({ ...signup, gender: 'male' })}
              startIcon={<MaleIcon />}
              className={clsx(classes.genderBtn, {
                [classes.activeGenderBtn]: signup.gender === 'male',
              })}
            >
              Monsieur
            </Button>
            <Button
              fullWidth
              variant="contained"
              disableElevation
              onClick={() => setSignup({ ...signup, gender: 'none' })}
              className={clsx(classes.genderBtn, {
                [classes.activeGenderBtn]: signup.gender === 'none',
              })}
            >
              Non renseigné
            </Button>
          </Box>
        ) : (
          <FormControl component="fieldset" required>
            <RadioGroup
              row
              aria-label="gender"
              name="gender"
              value={signup.gender}
              onChange={event => setSignup({ ...signup, gender: event.target.value })}
              className={classes.radioGroup}
              defaultValue="none"
            >
              <FormControlLabel value="female" control={<Radio />} label="Madame" />
              <FormControlLabel value="male" control={<Radio />} label="Monsieur" />
              <FormControlLabel value="none" control={<Radio />} label="Non renseigné" />
            </RadioGroup>
          </FormControl>
        )}
        <Box className={classes.inputGrid}>
          <TextField
            id="prénom"
            type="text"
            label="Prénom"
            variant="filled"
            value={signup.firstname}
            onChange={event => setSignup({ ...signup, firstname: event.target.value })}
            className={clsx(classes.gridItem, classes.firstnameInput)}
            InputLabelProps={{ classes: { root: classes.label, shrink: classes.shrinkedLabel } }}
          />
          <TextField
            id="nom"
            type="text"
            label="Nom"
            variant="filled"
            value={signup.lastname}
            onChange={event => setSignup({ ...signup, lastname: event.target.value })}
            className={clsx(classes.gridItem, classes.lastnameInput)}
            InputLabelProps={{ classes: { root: classes.label, shrink: classes.shrinkedLabel } }}
          />
          <DatePicker
            variant="filled"
            value={birthdate}
            onChange={setBirthdate}
            disableFuture
            openTo="year"
            format="dd/MM/yyyy"
            views={['year', 'month', 'day']}
            label="Date de naissance"
            inputVariant="filled"
            dateRangeIcon
            renderInput={params => (
              <TextField className={clsx(classes.gridItem, classes.birthdatePicker)} {...params} />
            )}
          />
          <TextField
            id="email"
            type="email"
            label="Adresse Email"
            variant="filled"
            value={signup.email}
            onChange={event => setSignup({ ...signup, email: event.target.value })}
            className={classes.largeGridItem}
            error={!!error}
            helperText={error}
            InputLabelProps={{ classes: { root: classes.label, shrink: classes.shrinkedLabel } }}
          />
          <TextField
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Mot de passe"
            variant="filled"
            value={signup.password}
            onChange={event => setSignup({ ...signup, password: event.target.value })}
            className={classes.largeGridItem}
            InputLabelProps={{ classes: { root: classes.label, shrink: classes.shrinkedLabel } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={() => setShowPassword(!showPassword)}
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box mt="20px">
          <FormControlLabel
            control={
              <Checkbox
                sx={{ '& svg': { fontSize: '40px' } }}
                checked={signup.newsletter}
                onChange={event => setSignup({ ...signup, newsletter: event.target.checked })}
                name="newsletter"
                color="primary"
              />
            }
            label="Si tu souhaites recevoir de l’inspiration, les bons plans et destinations du moment (une seule fois par semaine promis), inscrits toi à notre Newsletter !"
          />
        </Box>
        <Box mt="20px">
          <FormControlLabel
            control={
              <Checkbox
                sx={{ '& svg': { fontSize: '40px' } }}
                checked={signup.myTripLetter}
                onChange={event => setSignup({ ...signup, myTripLetter: event.target.checked })}
                name="myTripLetter"
                color="primary"
              />
            }
            label="Si tu souhaites recevoir les notification de tes séjours en cours, tu peux choisir à quelle fréquence!"
          />
        </Box>
        <Box mt={4} mb={1}>
          <Typography variant="body2" align="center">
            En sélectionnant “Accepter et continuer”, tu acceptes les{' '}
            <a href="#accepteretcontinuer">Conditions générales</a> de Explomaker.
          </Typography>
        </Box>
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={{
          [theme.breakpoints.down('sm')]: {
            borderRadius: '50px',
            textTransform: 'unset',
            fontSize: '22px',
            marginTop: '25px',
          },
        }}
        disabled={
          !(
            signup.gender &&
            signup.firstname &&
            signup.lastname &&
            signup.email &&
            signup.password &&
            signup.password.length >= 6
          )
        }
      >
        Accepter et continuer
      </Button>
    </Wrapper>
  )
}

export default SecondStep

import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/'
import makeStyles from '@mui/styles/makeStyles'
import { Add, Remove } from '@mui/icons-material'
import { useHistory } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { NewTripContext } from '../../contexts/newTrip'
import { FirebaseContext } from '../../contexts/firebase'
import TripWrapper from './TripWrapper'

const useStyles = makeStyles(theme => ({
  count: {
    borderRadius: '10px',
    width: 'fit-content',
    padding: '.5rem .75rem',
    [theme.breakpoints.down('sm')]: {
      border: 'none',
    },
  },
  btnsContainer: {
    display: 'grid',
    gridTemplate: '1fr / 1fr 1fr',
    gap: '40px',
    alignItems: 'center',
    paddingBottom: '50px',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: '0',
      gridAutoFlow: 'dense',
      backgroundColor: 'white',
      padding: '15px 30px',
      borderTop: 'thin solid #DFDFDF ',
      width: '100vw',
      marginLeft: '-30px',
      '& > button:nth-child(1)': {
        gridColumn: '2 / 3',
      },
      '& > button:nth-child(2)': {
        gridColumn: '1 / 2',
      },
    },
  },
  btnNext: {
    padding: '24px 61px',
    fontSize: '18px',
    fontWeight: '900',
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      padding: '17px 25px',
      fontSize: '20px',
      fontFamily: theme.typography.fontFamily,
      fontWeight: '500',
      textTransform: 'capitalize',
    },
  },
  travelersCount: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '100px',
    },
  },
  travelersCountTitle: {
    fontSize: '24px',
    fontWeight: '500',
    fontFamily: theme.typography.h1.fontFamily,
    margin: '50px 0 15px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '17px',
      fontFamily: theme.typography.fontFamily,
      marginTop: '0',
    },
  },
}))

const initialTravelers = (name, age, id) => ({
  name: name || '',
  age: age || 'adult',
  id: id || undefined,
  travelerId: uuidv4(),
})

const displayLocalTravelers = travelersDetails => {
  const tempArray = []
  if (travelersDetails?.length > 0) {
    travelersDetails.forEach(traveler => {
      tempArray.push({ ...initialTravelers(traveler.name, traveler.age, traveler.id) })
    })
  }
  return tempArray
}

const TripFourth = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { newTrip, setNewTrip } = useContext(NewTripContext)
  const { dictionary } = useContext(FirebaseContext)
  const [travelersDetails, setTravelersDetails] = useState(
    displayLocalTravelers(newTrip.travelersDetails)
  )
  const [ageOptions, setAgeOptions] = useState([])

  const nbTravelers = () => travelersDetails.length

  useEffect(() => {
    if (dictionary.travelers_age) {
      setAgeOptions(dictionary.travelers_age)
    }
  }, [dictionary])

  useEffect(() => {
    setNewTrip({
      ...newTrip,
      nbTravelers: nbTravelers(),
      travelersDetails,
    })
  }, [travelersDetails])

  const addTraveler = () => {
    setTravelersDetails([...travelersDetails, { ...initialTravelers() }])
  }

  const removeTraveler = () => {
    const tempTravelers = [...travelersDetails]
    tempTravelers.pop()
    setTravelersDetails([...tempTravelers])
  }

  const handleChange = (event, target, index) => {
    setTravelersDetails(prevState => {
      const tempPrevState = [...prevState]
      tempPrevState[index][target] = event.target.value
      return tempPrevState
    })
  }

  return (
    <TripWrapper
      currentStep="4"
      title="Les voyageurs"
      subtitle={
        !matchesXs &&
        'Connaitre le nombre de personnes qui t’accompagneront et leurs âges nous permettra de concevoir un séjour adapté à tous.'
      }
      backURL="/newtrip/tripThird"
    >
      <Box className={classes.travelersCount}>
        <Box mb={4}>
          <Typography className={classes.travelersCountTitle}>Nombre de voyageurs</Typography>
          <Paper variant="outlined" className={classes.count}>
            <Box display="inline-flex" alignItems="center">
              <IconButton
                onClick={() => {
                  if (nbTravelers() > 1) removeTraveler()
                }}
                size="large"
              >
                <Remove />
              </IconButton>
              <Box mx={1}>
                <Typography variant="h4">{nbTravelers()}</Typography>
              </Box>
              <IconButton
                onClick={() => {
                  if (nbTravelers() < 15) addTraveler()
                }}
                size="large"
              >
                <Add />
              </IconButton>
            </Box>
          </Paper>
        </Box>
        {!matchesXs && <Typography className={classes.travelersCountTitle}>Voyageurs</Typography>}
        {travelersDetails.map((traveler, index) => (
          <Box key={traveler.travelerId} display="flex" mb={4}>
            <Box mr={2}>
              <TextField
                hiddenLabel
                type="text"
                variant="filled"
                value={traveler.name}
                onChange={event => handleChange(event, 'name', index)}
              />
            </Box>
            <FormControl>
              <Select
                hiddenLabel
                variant="filled"
                value={traveler.age}
                onChange={event => handleChange(event, 'age', index)}
              >
                {ageOptions.map(option => (
                  <MenuItem key={uuidv4()} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
      </Box>
      <Box className={classes.btnsContainer}>
        <Button
          className={classes.btnNext}
          color="primary"
          variant="contained"
          onClick={() => history.push('/newtrip/tripFifth')}
          disabled={travelersDetails.some(traveler => traveler.name.length < 1)}
        >
          Continuer
        </Button>
      </Box>
    </TripWrapper>
  )
}
export default TripFourth

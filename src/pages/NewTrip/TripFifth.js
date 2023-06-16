import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import { Close, Info } from '@mui/icons-material'
import { v4 as uuidv4 } from 'uuid'

import { NewTripContext } from '../../contexts/newTrip'
import { FirebaseContext } from '../../contexts/firebase'
import { SessionContext } from '../../contexts/session'
import TripWrapper from './TripWrapper'
import { arrayShuffle } from '../../helper/functions'

const useStyles = makeStyles(theme => ({
  chip: {
    backgroundColor: theme.palette.primary.ultraLight,
    margin: '5px',
    padding: '10px 5px',
    color: theme.palette.primary.main,
    '& .MuiChip-deleteIcon': {
      color: 'unset',
    },
  },
  roundedBtn: {
    borderRadius: '50px',
    marginRight: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  autocomplete: {
    borderRadius: '50px',
    padding: '15px 20px !important',
    flexWrap: 'wrap',
    height: 'fit-content',
  },
  autocompleteFocus: {
    borderRadius: '35px 35px 0 0',
  },
  autoCompleteListBox: {
    backgroundColor: theme.palette.grey.f7,
    height: '350px',
    borderRadius: '0 0 35px 35px',
  },
  btnsContainer: {
    display: 'grid',
    gridTemplate: '1fr / 1fr 1fr',
    gap: '40px',
    alignItems: 'center',
    paddingBottom: '50px',
    [theme.breakpoints.down('sm')]: {
      bottom: '0',
      position: 'fixed',
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
  wishesContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  },
  mobileWishes: {
    width: 'calc(100vw + 100px)',
    height: '450px',
    position: 'relative',
    marginLeft: '-80px',
  },
  mobileOversizedContainer: {
    width: 'calc(100vw + 100px)',
    maxHeight: '450px',
    overflowX: 'auto',
    overflowY: 'none',
    display: 'grid',
    gridTemplate: 'auto / repeat(6, 250px)',
  },
}))

const TripFifth = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { newTrip, setNewTrip, cleanupNewTrip, currentSpot } = useContext(NewTripContext)
  const { firestore, timestampRef, dictionary, createNotifications } = useContext(FirebaseContext)
  const { user, setUser } = useContext(SessionContext)

  const [wishes, setWishes] = useState(newTrip.wishes || [])
  const [selectedValues, setSelectedValues] = useState([])
  const [wishesOptions, setWishesOptions] = useState([])
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [hasClicked, setHasClicked] = useState(false)

  useEffect(() => {
    if (hasClicked) {
      setTimeout(() => {
        setHasClicked(false)
      }, 2000)
    }
  }, [hasClicked])

  useEffect(() => {
    if (dictionary.meta_name_envies_sport) {
      console.log('ici cest le dico de linscription', dictionary)
      const shuffledWishes = arrayShuffle(dictionary.meta_name_envies_sport)
      console.log('shuffledwishes', shuffledWishes)
      setWishesOptions(shuffledWishes)
    }
  }, [dictionary])

  useEffect(() => {
    setNewTrip(prevState => ({ ...prevState, wishes }))
  }, [wishes])

  const handleTripCreation = () => {
    setHasClicked(true)
    const tempTravelers = newTrip.travelersDetails.map(traveler => {
      const { name, age, id, travelerId } = traveler
      if (id) {
        return { name, age, id, travelerId }
      }
      return { name, age, travelerId }
    })

    const tempDestination = newTrip.noDestination
      ? { noDestination: true, destination: null }
      : {
          destination: {
            ...newTrip.destination,
            ...(newTrip.destination.shortCountryName
              ? {
                  label: newTrip.destination.label,
                  place_id: newTrip.destination.value.place_id,
                  shortCountryName: newTrip.destination.shortCountryName,
                }
              : {
                  label: newTrip.destination.label,
                  place_id: newTrip.destination.value.place_id,
                }),
          },
        }

    const tempWishes = newTrip.wishes
    delete newTrip.wishes

    let tempMainPicture = ''
    if (currentSpot?.picture_slider?.length > 0) {
      tempMainPicture = currentSpot.picture_slider[0].src.original
    }
    const tempTrip = {
      ...newTrip,
      travelersDetails: tempTravelers,
      ...tempDestination,
      owner: user.id,
      editors: [user.id],
      currency: 'eur',
      createdAt: new timestampRef.fromDate(new Date()),
      title: newTrip.title.trim(),
      mainPicture: tempMainPicture,
    }

    firestore
      .collection('trips')
      .add({
        ...newTrip,
        travelersDetails: tempTravelers,
        ...tempDestination,
        owner: user.id,
        editors: [user.id],
        currency: 'eur',
        createdAt: new timestampRef.fromDate(new Date()),
        title: newTrip.title.trim(),
        mainPicture: tempMainPicture,
      })
      .then(docRef => {
        cleanupNewTrip()
        setUser({ ...user, lastCreatedTripId: docRef.id })
        const batch = firestore.batch()
        batch.set(firestore.collection('users').doc(user.id).collection('trips').doc(docRef.id), {
          role: 'owner',
        })
        tempWishes.forEach(wish => {
          batch.set(
            firestore.collection('trips').doc(docRef.id).collection('wishes').doc(uuidv4()),
            {
              ...wish,
              userId: user.id,
            }
          )
        })
        batch.commit()
        console.log('utilisateur', user)
        console.log('nouveauvoyage', newTrip)
        createNotifications(user, tempTrip, 'newTrip', 3)
        history.push('/newtrip/tripRecap')
      })
  }

  const handleSelect = values => {
    let tempValues = values.map(option => option.value).flat()
    if (typeof tempValues === 'undefined') {
      tempValues = []
    }
    setSelectedValues(tempValues)
    setWishes(values)
  }

  return (
    <TripWrapper
      currentStep="5"
      title={matchesXs ? 'Vos envies pour ce séjour' : 'Des envies particulières pour ce séjour ?'}
      subtitle={
        matchesXs
          ? 'Passions, sports, intérêts ... Ajoute des envies à ton séjour, nous les étudieront pour te créer le voyage parfait !'
          : 'Passions, sports, intérêts ... Recherche puis ajoute des envies à ton séjour ! Nous les prendrons en compte pour te créer le voyage parfait !'
      }
      backURL="/newtrip/tripFourth"
    >
      <>
        {!matchesXs ? (
          <Autocomplete
            onOpen={() => setIsAutocompleteOpen(true)}
            onClose={() => setIsAutocompleteOpen(false)}
            classes={{
              inputRoot: clsx(classes.autocomplete, {
                [classes.autocompleteFocus]: isAutocompleteOpen,
              }),
              paper: classes.autoCompleteListBox,
            }}
            multiple
            // freeSolo TODO
            options={wishesOptions}
            value={wishes}
            getOptionLabel={option => `${option.icon} ${option.label}`}
            onChange={(event, values) => handleSelect(values)}
            placeholder="Recherche"
            renderInput={params => <TextField {...params} hiddenLabel variant="filled" />}
            ChipProps={{
              className: classes.chip,
            }}
            clearIcon={<Close color="primary" fontSize="small" />}
            getOptionDisabled={() => wishes.length > 9}
          />
        ) : (
          // <Box className={classes.mobileWishes}>
          //   <Box className={classes.mobileOversizedContainer}>
          //     {wishesOptions.map(option => (
          //       <Box>{option.label}</Box>
          //     ))}
          //   </Box>
          // </Box>
          <Autocomplete
            onOpen={() => setIsAutocompleteOpen(true)}
            onClose={() => setIsAutocompleteOpen(false)}
            classes={{
              inputRoot: clsx(classes.autocomplete, {
                [classes.autocompleteFocus]: isAutocompleteOpen,
              }),
              paper: classes.autoCompleteListBox,
            }}
            multiple
            // freeSolo TODO
            options={wishesOptions}
            value={wishes}
            getOptionLabel={option => `${option.icon} ${option.label}`}
            onChange={(event, values) => handleSelect(values)}
            placeholder="Recherche"
            renderInput={params => <TextField {...params} hiddenLabel variant="filled" />}
            ChipProps={{
              className: classes.chip,
            }}
            clearIcon={<Close color="primary" fontSize="small" />}
            getOptionDisabled={() => wishes.length > 9}
          />
        )}

        <Box
          display="flex"
          alignItems="center"
          my={2}
          p={2}
          bgcolor="primary.ultraLight"
          borderRadius="10px"
        >
          <Info color="primary" style={{ marginRight: '16px' }} />
          <Typography>
            Une fois ajoutées, tes envies apparaitront ici. Fais toi plaisir, tu peux en ajouter
            jusqu’à 10 !
          </Typography>
        </Box>
      </>
      {currentSpot?.meta_envies?.length > 0 && currentSpot?.sub_type !== 'pays' && (
        <Box mb={5}>
          {!matchesXs && selectedValues.length < wishesOptions.length && (
            <Box mb={2}>
              <Typography variant="h6">Envies suggérées</Typography>
            </Box>
          )}
          <Box className={classes.wishesContainer}>
            {wishesOptions
              .filter(
                option =>
                  currentSpot.meta_envies
                    .map(envie => envie.id)
                    .includes(parseInt(option.value, 10)) &&
                  !wishes.some(wish => wish.value === option.value)
              )
              .map(option => {
                if (matchesXs || !selectedValues.includes(option.value)) {
                  return (
                    <Button
                      className={classes.roundedBtn}
                      key={option.value}
                      variant="contained"
                      color={selectedValues.includes(option.value) ? 'primary' : 'inherit'}
                      onClick={() => {
                        if (selectedValues.includes(option.value)) {
                          let tempWishes = wishes
                          tempWishes = tempWishes.filter(wish => wish.value !== option.value)
                          handleSelect(tempWishes)
                        } else {
                          handleSelect([...wishes, option])
                        }
                      }}
                      disabled={!selectedValues.includes(option.value) && wishes.length > 9}
                      startIcon={option.icon}
                    >
                      {option.label}
                    </Button>
                  )
                }
                return false
              })}
          </Box>
        </Box>
      )}
      <Box className={classes.btnsContainer}>
        <Button
          className={classes.btnNext}
          color="primary"
          variant="contained"
          onClick={handleTripCreation}
          disabled={wishes.length === 0}
        >
          Terminer
        </Button>
      </Box>
    </TripWrapper>
  )
}

export default TripFifth

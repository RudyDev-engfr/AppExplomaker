import React, { useContext, useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles, useTheme } from '@mui/styles'
import { PeopleAltRounded, StarRounded } from '@mui/icons-material'
import { v4 as uuidv4 } from 'uuid'
import { useHistory } from 'react-router-dom'

import CustomAvatar from '../../components/atoms/CustomAvatar'
import { FirebaseContext } from '../../contexts/firebase'
import { arrayShuffle } from '../../helper/functions'
import { SessionContext } from '../../contexts/session'

import arrowBack from '../../images/icons/arrow-back.svg'
import MobileTripPageHeader from '../../components/molecules/MobileTripPageHeader'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '30px',
    margin: '40px 30px 0 30px',
    [theme.breakpoints.down('sm')]: {
      margin: '20px',
      padding: '15px',
    },
  },
  title: {
    fontFamily: theme.typography.h1.fontFamily,
    fontSize: '28px',
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontFamily: theme.typography.fontFamily,
      fontSize: '20px',
      fontWeight: '500',
    },
  },
  greenRoundedButton: {
    backgroundColor: theme.palette.primary.ultraLight,
    color: theme.palette.primary.dark,
    padding: '.5rem 1rem',
    margin: '.5rem',
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
  },
  chip: {
    backgroundColor: theme.palette.primary.ultraLight,
    color: theme.palette.primary.main,
    margin: '5px',
    borderRadius: '50px',
    position: 'relative',
    top: '5px',
    '& .MuiChip-deleteIcon': {
      color: 'unset',
    },
  },
  mobileTitleContainer: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '57px 0 25px',
    alignItems: 'center',
  },
  mobileTitleTypo: {
    fontSize: '22px',
    fontWeight: '500',
  },
  mobileTitleIcon: {
    margin: '0 25px',
  },
  autocomplete: {
    borderRadius: '35px',
    padding: '10px 65px 10px 10px !important',
    height: 'unset !important',
  },
  autoCompleteBasicInput: {
    position: 'relative',
    top: '5px',
  },
}))

const Envies = ({ tripId, tripWishes, recommendedWishes, canEdit, tripTravelers }) => {
  const theme = useTheme()
  const classes = useStyles()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const history = useHistory()

  const { user } = useContext(SessionContext)
  const { firestore, dictionary } = useContext(FirebaseContext)

  const [wishesOptions, setWishesOptions] = useState([])
  const [wishes, setWishes] = useState([])
  const [othersWishes, setOthersWishes] = useState([])
  const [votes, setVotes] = useState([])

  useEffect(() => {
    let tempVotes = []
    const currentUserWishes = []
    let otherUsersWishes = []
    tripWishes.forEach(wish => {
      let isLabelInArray = false
      if (wish.userId === user.id) {
        currentUserWishes.push(wish)
      } else if (otherUsersWishes.some(otherUser => otherUser.userId === wish.userId)) {
        otherUsersWishes = otherUsersWishes.map(otherUser => {
          if (otherUser.userId === wish.userId) {
            return {
              ...otherUser,
              wishes: [...otherUser.wishes, wish],
            }
          }
          return { ...otherUser }
        })
      } else {
        otherUsersWishes.push({ userId: wish.userId, wishes: [wish] })
      }
      tempVotes = tempVotes.map(currentTempVote => {
        if (currentTempVote.label === wish.label) {
          isLabelInArray = true
          return { label: wish.label, users: [...currentTempVote.users, wish.userId] }
        }
        return currentTempVote
      })
      if (!isLabelInArray) {
        const tempVote = { label: wish.label, users: [wish.userId] }
        tempVotes.push(tempVote)
      }
    })
    setWishes(currentUserWishes)
    setOthersWishes(otherUsersWishes)
    tempVotes.sort((a, b) => b.users.length - a.users.length)
    setVotes(tempVotes)
  }, [tripWishes])

  useEffect(() => {
    console.log('là cest le dictionnaire', dictionary)
    if (dictionary.meta_name_envies_sport) {
      const shuffledWishes = arrayShuffle(dictionary.meta_name_envies_sport)
      console.log('les envies', shuffledWishes)
      setWishesOptions(shuffledWishes)
    }
  }, [dictionary])

  const handleSelect = values => {
    let tempValues = values.map(option => option.value).flat()
    if (typeof tempValues === 'undefined') {
      tempValues = []
    }
    setWishes(values)
  }

  const addWish = wish => {
    firestore
      .collection('trips')
      .doc(tripId)
      .collection('wishes')
      .add({ ...wish, userId: user.id })
  }

  const removeWish = wishId => {
    firestore.collection('trips').doc(tripId).collection('wishes').doc(wishId).delete()
  }

  return (
    <Box sx={{ marginBottom: '110px' }}>
      {matchesXs && (
        <>
          <MobileTripPageHeader isSticky />
          {/* <Box className={classes.mobileTitleContainer}>
            <IconButton
              className={classes.mobileTitleIcon}
              size="large"
              onClick={() => history.goBack()}
            >
              <img src={arrowBack} alt="" />
            </IconButton>
            <Typography className={classes.mobileTitleTypo}>Envies du séjour</Typography>
          </Box> */}
        </>
      )}
      <Paper className={classes.paper} sx={{ marginTop: '80px' }}>
        <Typography className={classes.title}>
          {matchesXs ? 'Top 3 des envies' : 'Envies du séjour'}
        </Typography>
        <Box my={2}>
          <Typography>
            Retrouves ici les envies des voyageurs pour ce séjour. Un excellent point de départ pour
            rechercher et organiser un voyage qui réponde au mieux aux attentes de l&apos;équipe du
            voyage.
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          {votes.map((vote, index) => {
            if (index > 2) {
              return
            }
            return (
              <Box
                key={uuidv4()}
                display="flex"
                justifyContent="space-between"
                width={`calc(${100 - 10 * index}% + ${matchesXs ? '15' : '30'}px)`}
                bgcolor={
                  index === 0 ? 'primary.ultraDark' : index === 1 ? 'primary.dark' : 'primary.main'
                }
                borderRadius="40px 0 0 40px"
                px={2}
                py={1.5}
                position="relative"
                right={matchesXs ? '-15px' : '-30px'}
              >
                <Box display="flex" alignItems="center">
                  <Box
                    borderRadius="50%"
                    bgcolor="white"
                    p={1}
                    width="30px"
                    height="30px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    color={
                      index === 0
                        ? 'primary.ultraDark'
                        : index === 1
                        ? 'primary.dark'
                        : 'primary.main'
                    }
                  >
                    <Typography variant="h5">
                      <Box component="span" fontWeight="bold">
                        {index + 1}
                      </Box>
                    </Typography>
                  </Box>
                  <Typography variant="h5">
                    <Box component="span" color="white" ml={2}>
                      {vote.label}
                    </Box>
                  </Typography>
                </Box>
                {!matchesXs && (
                  <Box display="flex" alignItems="center">
                    <Typography>
                      <Box component="span" color="white" mr={2}>
                        {vote.users.length} vote{vote.users.length > 1 && 's'}
                      </Box>
                    </Typography>
                    <CustomAvatar peopleIds={vote.users} />
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>
      </Paper>
      {canEdit && (
        <Paper className={classes.paper}>
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <StarRounded color="primary" fontSize="large" />
            </Box>
            <Typography className={classes.title}>Mes envies</Typography>
          </Box>
          <Box my={2}>
            <Typography>
              Passions, sports, intérêts, activités, destinations que tu souhaites visiter...
              Recherche puis ajoute des envies à ton séjour !
            </Typography>
          </Box>
          <Autocomplete
            multiple
            // freeSolo TODO
            classes={{
              inputRoot: classes.autocomplete,
              input: classes.autoCompleteBasicInput,
            }}
            options={wishesOptions}
            value={wishes}
            disableClearable={matchesXs}
            getOptionLabel={option => `${option.icon} ${option.label}`}
            onChange={(event, values, reason, detail) => {
              if (reason === 'selectOption') {
                addWish(values[values.length - 1])
              }
              if (reason === 'removeOption') {
                handleSelect(values)
                removeWish(detail.option.docId)
              }
              if (reason === 'clear') {
                const batch = firestore.batch()
                firestore
                  .collection('trips')
                  .doc(tripId)
                  .collection('wishes')
                  .where('userId', '==', user.id)
                  .get()
                  .then(docs => {
                    docs.forEach(doc => batch.delete(doc.ref))
                    batch.commit()
                  })
              }
              if (reason === 'createOption') {
                // TODO freesolo
              }
            }}
            placeholder="Rechercher des envies"
            renderInput={params => <TextField {...params} hiddenLabel variant="filled" />}
            ChipProps={{
              className: classes.chip,
            }}
            getOptionDisabled={() => wishes.length > 9}
            isOptionEqualToValue={(option, value) => option.value === value.value}
          />
          {wishesOptions.filter(
            option =>
              recommendedWishes.filter(wish => wish.id === parseInt(option.value, 10)) &&
              !wishes.some(wish => wish.value === option.value)
          ).length > 0 && (
            <>
              <Typography className={classes.title} sx={{ marginTop: theme.spacing(2) }}>
                Envies suggérées
              </Typography>
              {wishesOptions
                .filter(
                  option =>
                    recommendedWishes.some(wish => {
                      if (wish.id === parseInt(option.value, 10)) {
                        return true
                      }
                      return false
                    }) && !wishes.some(wish => wish.value === option.value)
                )
                .map(option => (
                  <Button
                    className={classes.greenRoundedButton}
                    key={option.value}
                    variant="contained"
                    onClick={() => addWish(option)}
                    disabled={wishes.length > 9}
                    startIcon={option.icon}
                    disableElevation
                  >
                    {option.label}
                  </Button>
                ))}
            </>
          )}
        </Paper>
      )}
      {othersWishes.length > 0 && (
        <Paper className={classes.paper}>
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              <PeopleAltRounded color="primary" fontSize="large" />
            </Box>
            <Typography className={classes.title}>Envies des participants</Typography>
          </Box>
          {canEdit && (
            <Box my={2}>
              <Typography>
                Clique sur les envies qui t&apos;intéressent pour les ajouter à ta liste
                d&apos;envies.
              </Typography>
            </Box>
          )}
          {othersWishes.map(otherUserWish => (
            <Paper key={otherUserWish.userId} variant="outlined" className={classes.paper}>
              <Box display="flex" alignItems="center">
                <CustomAvatar peopleIds={[otherUserWish.userId]} />
                <Typography variant="h5" sx={{ ml: 1 }}>
                  Envies de{' '}
                  {
                    tripTravelers.filter(traveler => otherUserWish.userId === traveler.id)[0]
                      ?.firstname
                  }
                </Typography>
              </Box>
              {otherUserWish.wishes.map(wish => (
                <Button
                  className={classes.greenRoundedButton}
                  key={`${wish.value}-${otherUserWish.userId}`}
                  variant="contained"
                  onClick={() => {
                    if (canEdit) {
                      const tempWish = { ...wish }
                      delete tempWish.docId
                      addWish(tempWish)
                    }
                  }}
                  disabled={
                    wishes.some(currentWish => currentWish.value === wish.value) ||
                    wishes.length > 9
                  }
                  startIcon={wish.icon}
                  disableElevation
                >
                  {wish.label}
                </Button>
              ))}
            </Paper>
          ))}
        </Paper>
      )}
    </Box>
  )
}

export default Envies

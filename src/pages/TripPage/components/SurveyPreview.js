import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/'
import makeStyles from '@mui/styles/makeStyles'
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Room from '@mui/icons-material/Room'
import WatchLaterRounded from '@mui/icons-material/WatchLaterRounded'

import { alpha } from '@mui/material/styles'
import Add from '@mui/icons-material/Add'
import clsx from 'clsx'
import { v4 as uuidv4 } from 'uuid'
import { format, formatDuration, intervalToDuration, isSameMinute } from 'date-fns'
import frLocale from 'date-fns/locale/fr'
import { useHistory } from 'react-router-dom'

import CustomAvatar from '../../../components/atoms/CustomAvatar'
import { EVENT_TYPES } from '../../../helper/constants'
import { rCTFF, stringToDate } from '../../../helper/functions'
import { SessionContext } from '../../../contexts/session'
import { FirebaseContext } from '../../../contexts/firebase'
import findIcon, { getTransportIcons } from '../../../helper/icons'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    gridArea: 'previewArea',
    display: 'grid',
    gridTemplate: 'max-content 1fr max-content / 1fr',
    backgroundColor: 'white',
    zIndex: '1',
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.grey.f7,
      marginBottom: '90px',
    },
  },
  headerContainer: {
    display: 'grid',
    gridTemplate: '1fr / auto',
    placeItems: 'start',
    padding: `${theme.spacing(3)} ${theme.spacing(1)} ${theme.spacing(2)}`,
    [theme.breakpoints.down('sm')]: {
      gridTemplate: '1fr / auto',
      placeItems: 'flex-start',
      paddingLeft: '20px',
    },
  },
  headerTitle: {
    justifySelf: 'start',
    paddingLeft: theme.spacing(2),
  },
  headerTitleChooseMode: {
    gridColumn: '2 / 4',
  },
  cardContainer: {
    padding: `0 ${theme.spacing(3)} 20px`,
    overflowY: 'auto',
  },
  cardPaper: {
    display: 'grid',
    gridTemplate: 'auto / 110px 1fr',
    padding: theme.spacing(2),
    borderRadius: '10px',
    marginBottom: theme.spacing(3),
    position: 'relative',
    border: '1px solid transparent',
    // Reset ButtonBase
    letterSpacing: '0.01071em',
    width: '100%',
    textAlign: 'left',
    alignItems: 'start',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplate: 'auto / 70px 1fr',
    },
  },
  chooseModePaper: {
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
  },
  selectedPaper: {
    backgroundColor: theme.palette.primary.ultraLight,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  radio: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1px solid lightgrey',
    backgroundColor: 'white',
    position: 'absolute',
    top: '15px',
    right: '15px',
  },
  selectedRadio: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    justifySelf: 'start',
    backgroundColor: theme.palette.primary.light,
    width: '90px',
    height: '90px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      color: 'white',
      fontSize: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '60px',
      height: '60px',
    },
  },
  addBtn: {
    backgroundColor: theme.palette.primary.ultraLight,
    border: 'none',
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.light, 0.2),
      border: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      height: '58px',
      fontSize: '20px',
      fontWeight: '500',
      lineHeight: '24px',
      textTransform: 'none',
    },
  },
  boldText: {
    fontWeight: 'bold',
  },
  bottomContainer: {
    padding: `${theme.spacing(2.5)} ${theme.spacing(3)}`,
    borderTop: '1px solid #DFDFDF',
    '& button': {
      padding: `${theme.spacing(2)} 0`,
      fontSize: '18px',
    },
  },
  iconBox: {
    width: '30px',
    height: '30px',
    backgroundColor: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    borderRadius: '5px',
  },
  intervalIconBox: {
    margin: `${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)} 0`,
    color: theme.palette.primary.ultraDark,
    backgroundColor: theme.palette.vertclair.light,
  },
  photo: {
    borderRadius: '10px',
    objectFit: 'cover',
    objectPosition: '50% 50%',
    width: '100%',
    height: '100%',
  },
}))

const SurveyPreview = ({
  setCurrentView,
  currentEvent,
  setCurrentEvent,
  tripId,
  setIsNewProposition,
  setEventType,
  setPreviousEvent,
  setSelectedPropositionIndex,
  canEdit,
}) => {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useContext(SessionContext)
  const { firestore, createNotificationsOnTrip } = useContext(FirebaseContext)

  const [isLoading, setIsLoading] = useState(true)
  const [chooseMode, setChooseMode] = useState(false)
  const [selectedProposition, setSelectedProposition] = useState()
  const [isValidationDialogOpen, setIsValidationDialogOpen] = useState(false)
  const [tripData, setTripData] = useState()

  const handleLike = index => {
    const tempPropositions = currentEvent.propositions
    if (tempPropositions[index].likes.includes(user.id)) {
      const tempLikes = tempPropositions[index].likes.filter(id => id !== user.id)
      tempPropositions[index].likes = tempLikes
    } else {
      const tempLikes = tempPropositions[index].likes
      tempLikes.push(user.id)
      tempPropositions[index].likes = tempLikes
    }
    firestore
      .collection('trips')
      .doc(tripId)
      .collection('planning')
      .doc(currentEvent.id)
      .set({ propositions: tempPropositions }, { merge: true })
  }

  const validateProposition = () => {
    const event = { type: currentEvent.type, ...currentEvent.propositions[selectedProposition] }

    firestore
      .collection('trips')
      .doc(tripId)
      .collection('planning')
      .doc(currentEvent.id)
      .set({ ...event })

    const tempPropositions = currentEvent.propositions.filter(
      (proposition, currentIndex) => currentIndex !== selectedProposition
    )

    if (tempPropositions.length > 0) {
      const rest = { ...currentEvent, propositions: tempPropositions, needNewDates: true }
      firestore
        .collection('trips')
        .doc(tripId)
        .collection('planning')
        .add({ ...rest })
    }

    createNotificationsOnTrip(user, tripData, tripId, 'surveyClose', 2, event)
    setCurrentView('planning')
  }

  useEffect(() => {
    firestore
      .collection('trips')
      .doc(tripId)
      .onSnapshot(doc => {
        const tempDoc = doc.data()
        setTripData(tempDoc)
      })
  }, [tripId])

  useEffect(() => {
    if (currentEvent?.type) {
      setIsLoading(false)
    }
  }, [currentEvent])

  return isLoading ? (
    <></>
  ) : (
    <>
      <Box className={classes.mainContainer}>
        <Box className={classes.headerContainer}>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <IconButton
              onClick={() => {
                if (chooseMode) {
                  setSelectedProposition()
                  setChooseMode(false)
                } else {
                  history.push(`/tripPage/${tripId}/planning`)
                  setCurrentEvent()
                  setCurrentView('planning')
                }
              }}
              size="large"
              sx={{
                [theme.breakpoints.down('sm')]: {
                  paddingX: '0',
                },
              }}
            >
              <ArrowBackIos style={{ transform: 'translate(5px ,0)' }} />
            </IconButton>
            <Typography
              variant="h5"
              className={clsx(classes.headerTitle, classes.boldText, {
                [classes.headerTitleChooseMode]: chooseMode,
              })}
            >
              {chooseMode ? 'Choisir une proposition' : 'Propositions'}
            </Typography>
          </Box>
          {/* {!chooseMode && (
            <Box display="flex" alignItems="center">
              <Typography sx={{ marginRight: theme.spacing(1) }}>
                {matchesXs ? 'Créateur :' : 'Sondage créé(e) par :'}
              </Typography>
              <CustomAvatar peopleIds={[currentEvent.createdBy]} />
            </Box>
          )} */}
        </Box>
        <Box className={classes.cardContainer}>
          {currentEvent.propositions.map((proposition, index) => (
            <Paper
              key={uuidv4()}
              component={ButtonBase}
              className={clsx(classes.cardPaper, {
                [classes.chooseModePaper]: chooseMode,
                [classes.selectedPaper]: chooseMode && selectedProposition === index,
              })}
              onClick={() => {
                if (chooseMode) {
                  setSelectedProposition(index)
                } else {
                  setPreviousEvent(currentEvent)
                  setSelectedPropositionIndex(index)
                  setCurrentEvent(proposition)
                  setCurrentView('preview')
                  history.push(
                    `/tripPage/${tripId}/planning?survey=${currentEvent.id}&proposition=${index}`
                  )
                }
              }}
            >
              {currentEvent.type !== EVENT_TYPES[3] ? (
                <Box className={classes.cardImage}>
                  <Box
                    sx={{
                      width: proposition?.location?.photos?.length > 0 ? '100%' : '50px',
                      height: proposition?.location?.photos?.length > 0 ? '100%' : '50px',
                      alignContent: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        proposition?.location?.photos?.length > 0
                          ? `${encodeURI(proposition?.location?.photos[0])}`
                          : findIcon(proposition.icon, currentEvent.type)
                      }
                      className={proposition?.location?.photos?.length > 0 && classes.photo}
                      sx={{
                        filter:
                          proposition?.location?.photos?.length > 0
                            ? ''
                            : 'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)',
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box className={classes.cardImage}>
                  <Box
                    sx={{
                      width: '90px',
                      height: '90px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: proposition.transports.length <= 2 ? 'center' : 'stretch',
                      justifyContent: proposition.transports.length === 1 && 'center',
                    }}
                  >
                    {getTransportIcons(proposition.transports).map((icon, iconIndex, iconArray) => (
                      <Box
                        sx={{
                          width: '45px',
                          height: '45px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          component="img"
                          src={icon}
                          sx={{
                            filter:
                              'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)',
                          }}
                          width={iconArray.length === 1 ? '45px' : '26px'}
                          height={iconArray.length === 1 ? '45px' : '26px'}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              {chooseMode && (
                <Box
                  className={clsx(classes.radio, {
                    [classes.selectedRadio]: selectedProposition === index,
                  })}
                >
                  {selectedProposition === index && <Check />}
                </Box>
              )}
              <Box>
                <Typography color="primary">
                  {currentEvent.type === EVENT_TYPES[0]
                    ? `${format(stringToDate(proposition.startTime), 'dd MMMM')} - ${format(
                        stringToDate(proposition.endTime),
                        'dd MMMM'
                      )}`
                    : currentEvent.type === EVENT_TYPES[1]
                    ? rCTFF(proposition.flights[0].date, 'dd MMMM')
                    : currentEvent.type === EVENT_TYPES[3]
                    ? `${format(
                        stringToDate(proposition.transports[0].startTime),
                        'dd MMMM'
                      )} - ${format(
                        stringToDate(
                          proposition.transports[proposition.transports.length - 1].endTime
                        ),
                        'dd MMMM'
                      )}`
                    : (currentEvent.type === EVENT_TYPES[2] ||
                        currentEvent.type === EVENT_TYPES[4]) &&
                      `${format(stringToDate(proposition.startTime), 'HH:mm')} - ${format(
                        stringToDate(proposition.endTime),
                        'HH:mm'
                      )}`}
                </Typography>
                <Typography variant="subtitle1" color="textPrimary">
                  <Box fontWeight="bold" component="span">
                    {proposition.title.length > 39
                      ? `${proposition.title.substring(0, 39)}...`
                      : proposition.title}
                  </Box>
                </Typography>
                <Typography color="textPrimary">{proposition.description}</Typography>
                <Typography color="textPrimary">{proposition.price} €</Typography>
                {currentEvent.type === EVENT_TYPES[1] && (
                  <Typography>
                    {proposition.flights.length >= 1
                      ? `${proposition.flights.length - 1} escale${
                          proposition.flights.length - 1 > 1 ? 's' : ''
                        }`
                      : 'Direct'}{' '}
                    &#9679;{' '}
                    {formatDuration(
                      intervalToDuration({
                        start: rCTFF(proposition.flights[0].data.timings[0]),
                        end: rCTFF(
                          proposition.flights[proposition.flights.length - 1].data.timings[1]
                        ),
                      }),
                      {
                        format: ['days', 'hours', 'minutes'],
                        locale: frLocale,
                      }
                    )
                      .replace('jours', 'j')
                      .replace('jour', 'j')
                      .replace('heures', 'h')
                      .replace('heure', 'h')
                      .replace('minutes', 'min')
                      .replace('minute', 'min')}
                  </Typography>
                )}
                {currentEvent.type === EVENT_TYPES[3] && (
                  <>
                    <Typography variant="subtitle2" color="textSecondary">
                      {proposition.transports.length} transport
                      {proposition.transports.length > 1 && 's'} •{' '}
                      {formatDuration(
                        intervalToDuration({
                          start: rCTFF(proposition.transports[0].startTime),
                          end: rCTFF(
                            proposition.transports[proposition.transports.length - 1].endTime
                          ),
                        }),
                        {
                          format: ['days', 'hours', 'minutes'],
                          locale: frLocale,
                        }
                      )
                        .replace('jours', 'j')
                        .replace('jour', 'j')
                        .replace('heures', 'h')
                        .replace('heure', 'h')
                        .replace('minutes', 'min')
                        .replace('minute', 'min')}
                    </Typography>
                    {proposition.transports.map((transport, transportIndex, currentArray) => (
                      <>
                        <Box display="flex" alignItems="center">
                          <Box className={classes.iconBox}>
                            <Box
                              sx={{
                                width: '14px',
                                height: '14px',
                                alignContent: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Box
                                component="img"
                                src={findIcon(transport.icon, currentEvent.type)}
                                sx={{
                                  filter:
                                    'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)',
                                }}
                              />
                            </Box>
                          </Box>
                          <Typography color="textPrimary">
                            {formatDuration(
                              intervalToDuration({
                                start: rCTFF(transport.startTime),
                                end: rCTFF(transport.endTime),
                              }),
                              {
                                format: ['days', 'hours', 'minutes'],
                                locale: frLocale,
                              }
                            )
                              .replace('jours', 'j')
                              .replace('jour', 'j')
                              .replace('heures', 'h')
                              .replace('heure', 'h')
                              .replace('minutes', 'min')
                              .replace('minute', 'min')}
                          </Typography>
                        </Box>
                        {transportIndex < currentArray.length - 1 && (
                          <Box display="flex" alignItems="center">
                            <Box className={clsx(classes.iconBox, classes.intervalIconBox)}>
                              <WatchLaterRounded fontSize="small" />
                            </Box>

                            {isSameMinute(
                              rCTFF(transport.endTime),
                              rCTFF(currentArray[transportIndex + 1].startTime)
                            ) ? (
                              <Typography color="secondary">
                                Pas de temps de correspondance
                              </Typography>
                            ) : (
                              <Typography color="textPrimary">
                                {formatDuration(
                                  intervalToDuration({
                                    start: rCTFF(transport.endTime),
                                    end: rCTFF(currentArray[transportIndex + 1].startTime),
                                  }),
                                  {
                                    format: ['days', 'hours', 'minutes'],
                                    locale: frLocale,
                                  }
                                )
                                  .replace('jours', 'j')
                                  .replace('jour', 'j')
                                  .replace('heures', 'h')
                                  .replace('heure', 'h')
                                  .replace('minutes', 'min')
                                  .replace('minute', 'min')}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </>
                    ))}
                  </>
                )}
                <Box display="flex" alignItems="center">
                  {(currentEvent.type === EVENT_TYPES[0] ||
                    currentEvent.type === EVENT_TYPES[2] ||
                    currentEvent.type === EVENT_TYPES[4]) && (
                    <>
                      <Room fontSize="small" color="action" />
                      <Typography color="textPrimary">{proposition.location.label}</Typography>
                    </>
                  )}
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  minHeight="44px"
                >
                  {proposition.likes.length === 0 ? (
                    <Typography color="textPrimary">0 vote</Typography>
                  ) : (
                    <CustomAvatar peopleIds={proposition.likes} isLike />
                  )}

                  {!chooseMode && canEdit && (
                    <Button
                      variant="contained"
                      color={proposition.likes.includes(user.id) ? 'primary' : 'inherit'}
                      startIcon={
                        proposition.likes.includes(user.id) ? <Favorite /> : <FavoriteBorder />
                      }
                      onClick={event => {
                        event.stopPropagation()
                        handleLike(index)
                      }}
                    >
                      J&apos;aime
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
          {!chooseMode && currentEvent.propositions.length < 3 && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Add />}
              fullWidth
              className={classes.addBtn}
              onClick={() => {
                setIsNewProposition(true)
                setEventType(currentEvent.type)
                setCurrentView('creator')
              }}
            >
              Ajouter une proposition
            </Button>
          )}
        </Box>
        <Box className={classes.bottomContainer}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              if (!chooseMode) {
                setChooseMode(true)
              } else if (chooseMode && typeof selectedProposition !== 'undefined') {
                setIsValidationDialogOpen(true)
              }
            }}
            disabled={chooseMode && typeof selectedProposition === 'undefined'}
          >
            {chooseMode ? 'valider cette proposition' : 'choisir une proposition'}
          </Button>
        </Box>
      </Box>
      <Dialog open={isValidationDialogOpen} onClose={() => setIsValidationDialogOpen(false)}>
        <DialogTitle className={classes.deleteDialogTitle} align="center">
          Choisir la proposition
        </DialogTitle>
        <Box position="absolute" top="2%" right="2%">
          <IconButton onClick={() => setIsValidationDialogOpen(false)} size="large">
            <Close />
          </IconButton>
        </Box>
        <Box mb={5}>
          <Divider />
        </Box>
        <DialogContent>
          <DialogContentText variant="h4" align="center" color="textPrimary" component="h3">
            La proposition sélectionnée sera conservée dans le planning.
          </DialogContentText>
          <DialogContentText align="center">
            Les autres propositions seront conservée avec les événements sans date
          </DialogContentText>
          <DialogContentText align="center">
            Encore un doute pour choisir ? Les avis des compagnons de voyages sont là pour
            t&apos;aiguiller.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ margin: '25px' }}>
          <Button
            onClick={() => setIsValidationDialogOpen(false)}
            variant="contained"
            autoFocus
            disableElevation
            color="secondary"
          >
            Retour
          </Button>
          <Button onClick={validateProposition} variant="contained" disableElevation>
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SurveyPreview

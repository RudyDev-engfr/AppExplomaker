import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { useMount, useSetState } from 'react-use'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Fab from '@mui/material/Fab'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import useMediaQuery from '@mui/material/useMediaQuery'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Checkbox from '@mui/material/Checkbox'
import { makeStyles, useTheme } from '@mui/styles'
import Add from '@mui/icons-material/Add'
import AddAPhoto from '@mui/icons-material/AddAPhoto'
import Info from '@mui/icons-material/Info'
import Delete from '@mui/icons-material/Delete'
import Camera from '@mui/icons-material/Camera'
import Close from '@mui/icons-material/Close'
import PersonAddAlt1 from '@mui/icons-material/PersonAddAlt1'
import PersonRemoveAlt1 from '@mui/icons-material/PersonRemoveAlt1'

import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded'
/* import ToggleButton from '@mui/lab/ToggleButton'
import ToggleButtonGroup from '@mui/lab/ToggleButtonGroup' */
import { v4 as uuidv4 } from 'uuid'
import clsx from 'clsx'
import { toast } from 'react-toastify'
import { geocodeByPlaceId, getLatLng } from 'react-google-places-autocomplete'
import { isWithinInterval } from 'date-fns'
import ReactJoyride, { STATUS } from 'react-joyride'
import a11yChecker from 'a11y-checker'

import GooglePlacesAutocomplete from '../../components/atoms/GooglePlacesAutocomplete'
import TripPageNav from './components/TripPageNav'
import Preview from './Preview'
import Envies from './Envies' /* 
import Photos from './Photos'
import Documents from './Documents'
import Notes from './Notes'
import Inspiration from './Inspiration' */
import { filterObjectByValue, rCTFF } from '../../helper/functions'
import { fieldValueRef, FirebaseContext } from '../../contexts/firebase'
import {
  BUDGET_OPTIONS,
  CONTEXT_OPTIONS,
  CURRENCIES,
  ROLES,
  EVENT_TYPES,
  NATURALADMINS,
} from '../../helper/constants'
import CustomAvatar from '../../components/atoms/CustomAvatar'
import Chat from '../../components/molecules/Chat'
import DateRangesBar from '../../components/atoms/DateRangesBar'
import Planning from './Planning'
import DateRangePicker from '../../components/atoms/DateRangePicker'
import { SessionContext } from '../../contexts/session'
import Loader from '../../components/Loader'
import Head from '../../components/molecules/Head'
import PlanningContextProvider from '../../contexts/planning'
import ava1 from '../../images/avatar/ava1.png'
import ava2 from '../../images/avatar/ava2.png'
import ava3 from '../../images/avatar/ava3.png'
import ava4 from '../../images/avatar/ava4.png'
import ava5 from '../../images/avatar/ava5.png'
import flat from '../../images/flag.png'
import pencil from '../../images/icons/pencil-btn.svg'
import arrow from '../../images/icons/arrow-grey.svg'
import TripLogs from './TripLogs'
import usePrevious from '../../hooks/usePrevious'
import { TripContext } from '../../contexts/trip'
import SocialNavbar from './SocialNavbar'
import AIChatWindow from '../../components/AI/AIChatWindow'
import AddCollaboratorsButton from '../../components/atoms/AddCollaboratorsButton'
import TripGuide from './components/TripGuide'
import DesktopEditEditorGrid from './components/DesktopEditEditorGrid'
import MobileEditEditorGrid from './components/MobileEditEditorGrid'
import TripPageModal from '../../components/molecules/TripPageModal'
import logGroup from '../../helper/joyride'
import CustomTooltip from '../../components/JoyRide/CustomTooltip'

const useStyles = makeStyles(theme => ({
  content: {
    minHeight: '100vh',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      minHeight: 'calc(100vh - 80px)',
      backgroundColor: 'white !veryimportant',
    },
  },
  rowPaper: {
    borderRadius: '10px',
    padding: '15px',
    margin: '20px',
    [theme.breakpoints.down('sm')]: {
      border: 'unset',
      borderBottom: `thin solid ${theme.palette.grey.bd}`,
      borderRadius: '0',
      marginLeft: '-2rem',
      marginRight: '-2rem',
      margin: '0',
    },
  },
  radio: { display: 'none' },
  roundedBtn: {
    borderRadius: '50px',
    margin: '0 10px',
    [theme.breakpoints.down('sm')]: {
      margin: '5px',
    },
  },
  gridTravelers: {
    margin: '20px 0',
    display: 'grid',
    gridTemplate: '1fr / 1fr 200px 44px',
    gridGap: '15px',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      gridTemplate: '1fr 1fr / 1fr 60px',
      backgroundColor: theme.palette.grey.f7,
      padding: '15px',
      borderRadius: '20px',
    },
  },
  travelersCountTitle: {
    fontSize: '24px',
    fontWeight: '500',
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      fontSize: '17px',
      fontFamily: theme.typography.fontFamily,
      marginTop: '0',
    },
  },
  travelerTitleXs: {
    fontSize: '22px',
    fontFamily: theme.typography.fontFamily,
  },
  textFieldTitle: {
    fontSize: '24px',
    fontWeight: '500',
    fontFamily: theme.typography.h1.fontFamily,
    marginBottom: '15px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
      fontFamily: theme.typography.fontFamily,
      margin: '30px 0 15px',
    },
  },
  textField: {
    fontSize: '28px',
    fontWeight: '700',
    fontFamily: theme.typography.h1.fontFamily,
    borderRadius: '10px',
    marginBottom: '20px',
    padding: '15px 15px 10px 20px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '22px',
      fontWeight: '400',
      fontFamily: theme.typography.fontFamily,
    },
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '20px',
    backgroundColor: theme.palette.primary.ultraLight,
    padding: '20px',
    marginBottom: '20px',
    '& > div': {
      height: '24px',
    },
    '& p': {
      fontSize: '14px',
      marginLeft: '15px',
      color: theme.palette.grey[33],
    },
  },
  infoTripDescriptionContainer: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '20px',
    backgroundColor: theme.palette.primary.ultraLight,
    padding: '20px',
    margin: '20px 0',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: '15px',
    },
  },
  warningContainer: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.secondary.ultraLight,
  },
  modificationTitle: {
    color: theme.palette.primary.main,
    fontSize: '14px',
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      fontFamily: theme.typography.fontFamily,
    },
  },
  modificationTitleData: {
    fontSize: '17px',
    fontFamily: theme.typography.h1.fontFamily,
    color: theme.palette.grey.black,
    [theme.breakpoints.down('sm')]: {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.grey[33],
      fontWeight: '400',
    },
  },
  dividerDeparture: {
    height: '42px',
  },
  betweenDates: {
    margin: '0 10px',
  },
  modaltitles: {
    fontSize: '24px',
    fontWeight: '500',
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
      fontFamily: theme.typography.fontFamily,
      margin: '30px 0 15px',
    },
  },
  textarea: {
    padding: '10px 12px',
    width: '100%',
    fontSize: '17px',
    borderRadius: '10px',
    border: '1px solid #BDBDBD',
    lineHeight: '23px',
    '&:active': {
      border: '2px solid #009d8c',
    },
    '&:focus': {
      border: '2px solid #009d8c',
    },
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      padding: '28px 25px',
      fontFamily: theme.typography.fontFamily,
    },
  },
  infoTitles: {
    fontWeight: '500',
    fontSize: '24px',
    fontFamily: theme.typography.h1.fontFamily,
    [theme.breakpoints.down('sm')]: {
      marginTop: '20px',
      fontWeight: 'none',
      fontSize: '20px',
      fontFamily: theme.typography.fontFamily,
    },
  },
  btnCopyContainer: {
    borderRadius: '10px',
    margin: '15px 0',
    padding: '20px 15px',
    justifySelf: 'center',
  },
  typoCopyBtn: {
    fontSize: '16px',
    [theme.breakpoints.down('sm')]: {
      textTransform: 'none',
      fontSize: '20px',
      fontWeight: '500',
    },
  },
  fab: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '50px',
  },
  travelerRowInput: {
    height: '56px',
  },
}))

const TravelerRow = ({
  traveler,
  ageOptions,
  setModalTravelers,
  index,
  nbTravelers,
  modalTravelers,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const [currentTravelerName, setCurrentTravelerName] = useState(traveler.name)
  const [currentTravelerAge, setCurrentTravelerAge] = useState(traveler.age)
  const [currentTravelerId, setCurrentTravelerId] = useState(traveler.id)

  useEffect(() => {
    if (currentTravelerAge && currentTravelerName) {
      setModalTravelers(prevState => {
        const tempPrevState = structuredClone(prevState)
        tempPrevState[index].name = currentTravelerName
        tempPrevState[index].age = currentTravelerAge
        if (currentTravelerId) {
          tempPrevState[index].id = currentTravelerId
        }
        return tempPrevState
      })
    }
  }, [currentTravelerName, currentTravelerAge, currentTravelerId])

  return (
    <Box className={classes.gridTravelers}>
      <TextField
        hiddenLabel
        type="text"
        variant="filled"
        value={currentTravelerName}
        onChange={event => setCurrentTravelerName(event.target.value)}
        InputProps={{
          readOnly: currentTravelerId,
          classes: { root: classes.travelerRowInput },
        }}
        sx={{ [theme.breakpoints.down('sm')]: { gridColumn: '1 / 3' } }}
      />
      <FormControl fullWidth>
        <Select
          MenuProps={{ sx: { zIndex: '100000' } }}
          hiddenLabel
          variant="filled"
          value={currentTravelerAge}
          onChange={event => setCurrentTravelerAge(event.target.value)}
          inputProps={{
            inputComponent: ({ inputRef, ...other }) => (
              <Input {...other} sx={{ height: '50px' }} ref={inputRef} />
            ),
          }}
          className={classes.travelerRowInput}
        >
          {ageOptions.map(option => (
            <MenuItem key={uuidv4()} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {!currentTravelerId && (
        <IconButton
          onClick={() => {
            if (nbTravelers > 1)
              setModalTravelers(
                modalTravelers.filter((actualTraveler, currentIndex) => currentIndex !== index)
              )
          }}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            width: '44px',
            height: '44px',
            borderRadius: '50px',
            zIndex: 1000,
            '&:hover': {
              backgroundColor: theme.palette.secondary.main,
              color: 'white',
            },
            border: '2px solid white',
            justifySelf: 'center',
            alignSelf: 'center',
            [theme.breakpoints.down('sm')]: {
              gridColumn: '2 / 3',
              width: '50px',
              height: '50px',
            },
          }}
        >
          <PersonRemoveAlt1
            sx={{
              fontSize: '26px',
              color: 'white',
              [theme.breakpoints.down('sm')]: {
                fontSize: '29.5px',
              },
            }}
          />
        </IconButton>
      )}
    </Box>
  )
}

const TripPage = () => {
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const history = useHistory()
  const { tripId } = useParams()
  const location = useLocation()
  const classes = useStyles()

  const {
    getSpotByDestination,
    genericSpot,
    testUniqueSpot,
    firestore,
    dictionary,
    timestampRef,
    updateTrip,
    getUserById,
    createNotificationsOnTrip,
  } = useContext(FirebaseContext)
  const { user } = useContext(SessionContext)
  const {
    tripData,
    setTripData,
    openModal,
    setOpenModal,
    matches1600,
    isChatOpen,
    setIsChatOpen,
    currentActiveTab,
    setCurrentActiveTab,
    currentTravelers,
    canEdit,
    setCanEdit,
    setNbTravelers,
    modalTravelers,
    setModalTravelers,
    nbTravelers,
  } = useContext(TripContext)
  const [isLoading, setIsLoading] = useState(true)
  const [carouselImages, setCarouselImages] = useState([])
  const [tripTravelers, setTripTravelers] = useState([])
  const [tripWishes, setTripWishes] = useState([])
  const [registeredTravelers, setRegisteredTravelers] = useState([])
  const [title, setTitle] = useState('')
  const [currentDestination, setCurrentDestination] = useState()
  const [currentDateRange, setCurrentDateRange] = useState(['', ''])
  const [dateRangeForPicker, setDateRangeForPicker] = useState(['', ''])
  const [description, setDescription] = useState('')
  const [currentContext, setCurrentContext] = useState('')
  const [currentBudget, setCurrentBudget] = useState('')
  const [currency, setCurrency] = useState('')
  const [ageOptions, setAgeOptions] = useState([])
  const [isShowingRemovedContributors, setIsShowingRemovedContributors] = useState(true)
  const [recommendedWishes, setRecommendedWishes] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [uploadedPhotos, setUplodedPhotos] = useState([])
  const [generatedAvatars, setGeneratedAvatars] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [tripSpot, setTripSpot] = useState()
  // eslint-disable-next-line no-unused-vars
  const [testSpot, setTestSpot] = useState()
  const [allowCreateDateNotif, setAllowCreateDateNotif] = useState(false)
  const previousDateRange = usePrevious(currentDateRange)

  // init Joyride
  const [{ mobileRun, mobileSteps }, setMobileState] = useSetState({
    mobileRun: false,
    mobileSteps: [
      {
        content: (
          <Typography>
            Suivez ce tutoriel pour découvrir comment préparer votre séjour avec Explomaker
          </Typography>
        ),
        placement: 'center',
        target: 'body',
        title: 'Bienvenue sur Explomaker, votre compagnon de voyage ultime !',
      },
      {
        content: (
          <>
            <Typography sx={{ marginBottom: '10px' }}>
              Choissisez rapidement choisir votre destination et les dates qui vous conviennent. En
              manque d’inspiration ? On vous guide pour choisir.
            </Typography>
            <Typography>
              Cette étape initiale donne le ton à votre voyage. Elle vous permet de visualiser la
              durée de votre séjour et de commencer à imaginer les activités que vous pourriez y
              faire.
            </Typography>
          </>
        ),
        title: 'Définir la date et le lieu du séjour',
        placement: 'right',
        target: '.pencil-button-mobile',
      },
      {
        content: (
          <>
            <Typography sx={{ marginBottom: '10px' }}>
              Invitez vos amis, votre famille ou vos collègues à se joindre à votre voyage. Chacun
              peut apporter ses idées et ses envies et consulter les détails du week-end / voyage.
            </Typography>
            <Typography>
              Voyager en groupe enrichit l&apos;expérience. La collaboration permet de prendre en
              compte les préférences de chacun et de créer un voyage qui plait à tous.
            </Typography>
          </>
        ),
        placement: 'top',
        target: '.inviteButton-mobile',
        title: 'Inviter les participants',
      },
      {
        content: (
          <>
            <Typography sx={{ marginBottom: '10px' }}>
              Plongez-vous dans un guide riche de votre destination. Explorez les conseils locaux,
              infos pratiques, points culturels de votre destination, et une variété
              d&apos;expériences et d&apos;activités à ne pas manquer.
            </Typography>
            <Typography>
              Être bien informé en amont maximise votre expérience et vous prépare à une immersion
              complète.
            </Typography>
          </>
        ),
        placement: 'right',
        target: '.guidePage-mobile',
        title: 'Consulter le guide du séjour',
      },
      {
        content: (
          <>
            <Typography sx={{ marginBottom: '10px' }}>
              Utilisez l&apos;assistant Explomaker pour obtenir des suggestions d&apos;itinéraires,
              des informations sur les destinations et des conseils personnalisés.
            </Typography>
            <Typography>
              L&apos;assistant agit comme un expert de voyage, vous guidant à travers les meilleures
              options pour un séjour mémorable.
            </Typography>
          </>
        ),
        title: "Solliciter l'assistant de voyage",
        placement: 'bottom',
        target: '.assistantButton-mobile',
      },
      {
        content: (
          <>
            <Typography sx={{ marginBottom: '10px' }}>
              Organisez vos activités, réservations et itinéraires dans un planning centralisé.
            </Typography>
            <Typography>
              Un planning bien structuré garantit que vous profiterez au maximum de chaque moment de
              votre voyage, sans stress ni oublis.
            </Typography>
          </>
        ),
        placement: 'right',
        title: 'Créer le planning du voyage',
        target: '.planningPage-mobile',
      },
    ],
  })
  const [{ run, steps }, setState] = useSetState({
    run: false,
    steps: [
      {
        content: (
          <Typography>
            Suivez ce tutoriel pour découvrir comment préparer votre séjour avec Explomaker
          </Typography>
        ),
        placement: 'center',
        target: 'body',
        title: 'Bienvenue sur Explomaker, votre compagnon de voyage ultime !',
      },
      {
        content: (
          <>
            <Typography sx={{ marginBottom: '10px' }}>
              Choissisez rapidement choisir votre destination et les dates qui vous conviennent. En
              manque d’inspiration ? On vous guide pour choisir.
            </Typography>
            <Typography>
              Cette étape initiale donne le ton à votre voyage. Elle vous permet de visualiser la
              durée de votre séjour et de commencer à imaginer les activités que vous pourriez y
              faire.
            </Typography>
          </>
        ),
        title: 'Définir la date et le lieu du séjour',
        placement: 'right',
        target: '.pencil-button-desktop',
      },
      {
        content: (
          <>
            <Typography sx={{ marginBottom: '10px' }}>
              Invitez vos amis, votre famille ou vos collègues à se joindre à votre voyage. Chacun
              peut apporter ses idées et ses envies et consulter les détails du week-end / voyage.
            </Typography>
            <Typography>
              Voyager en groupe enrichit l&apos;expérience. La collaboration permet de prendre en
              compte les préférences de chacun et de créer un voyage qui plait à tous.
            </Typography>
          </>
        ),
        placement: 'left',
        target: '.inviteButton-desktop',
        title: 'Inviter les participants',
      },
      {
        content: (
          <>
            <Typography sx={{ marginBottom: '10px' }}>
              Plongez-vous dans un guide riche de votre destination. Explorez les conseils locaux,
              infos pratiques, points culturels de votre destination, et une variété
              d&apos;expériences et d&apos;activités à ne pas manquer.
            </Typography>
            <Typography>
              Être bien informé en amont maximise votre expérience et vous prépare à une immersion
              complète.
            </Typography>
          </>
        ),
        placement: 'right',
        target: '.guidePage-desktop',
        title: 'Consulter le guide du séjour',
      },
      {
        content: (
          <>
            <Typography sx={{ marginBottom: '10px' }}>
              Utilisez l&apos;assistant Explomaker pour obtenir des suggestions d&apos;itinéraires,
              des informations sur les destinations et des conseils personnalisés.
            </Typography>
            <Typography>
              L&apos;assistant agit comme un expert de voyage, vous guidant à travers les meilleures
              options pour un séjour mémorable.
            </Typography>
          </>
        ),
        title: "Solliciter l'assistant de voyage",
        placement: 'bottom',
        target: '.assistantButton-desktop',
      },
      {
        content: (
          <>
            <Typography sx={{ marginBottom: '10px' }}>
              Organisez vos activités, réservations et itinéraires dans un planning centralisé.
            </Typography>
            <Typography>
              Un planning bien structuré garantit que vous profiterez au maximum de chaque moment de
              votre voyage, sans stress ni oublis.
            </Typography>
          </>
        ),
        placement: 'right',
        title: 'Créer le planning du voyage',
        target: '.planningPage-desktop',
      },
    ],
  })

  useMount(() => {
    a11yChecker()
  })

  const handleUserUpdate = data => {
    firestore
      .collection('users')
      .doc(user.id)
      .set(
        {
          ...data,
        },
        { merge: true }
      )
      .then(() => true)
  }

  const handleFirstLoad = () => {
    if (matchesXs && typeof user?.isFirstTrip !== 'undefined' && user?.isFirstTrip !== 'no') {
      setMobileState({ mobileRun: true })
    }
    if (!matchesXs && typeof user?.isFirstTrip !== 'undefined' && user?.isFirstTrip !== 'no') {
      setState({
        run: true,
      })
    }
  }

  useEffect(() => {
    handleFirstLoad()
  }, [matchesXs])

  const handleJoyrideCallback = data => {
    if (!matchesXs) {
      const { status, type } = data
      const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED]

      if (finishedStatuses.includes(status)) {
        setState({ run: false })
        handleUserUpdate({ isFirstTrip: 'no' })
      }

      logGroup(type, data)
    }
    if (matchesXs) {
      const { status, type } = data
      const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED]

      if (finishedStatuses.includes(status)) {
        setMobileState({ mobileRun: false })
        handleUserUpdate({ isFirstTrip: 'no' })
      }

      logGroup(type, data)
    }
  }

  const initialTraveler = () => ({
    name: '',
    age: 'adult',
    travelerId: uuidv4(),
  })

  useEffect(() => {
    testUniqueSpot(setTestSpot)
  }, [])

  useEffect(() => {
    if (previousDateRange !== currentDateRange && allowCreateDateNotif) {
      createNotificationsOnTrip(
        user,
        tripData,
        tripId,
        'dateUpdate',
        3,
        undefined,
        previousDateRange
      )
      setAllowCreateDateNotif(false)
    }
  }, [currentDateRange])

  useEffect(() => {
    const currentImages = []
    if (tripSpot?.picture_slider) {
      tripSpot.picture_slider.forEach(picture => currentImages.push(picture))
    } else {
      genericSpot.picture_slider.forEach(picture => currentImages.push(picture))
    }
    if (tripSpot?.meta_envies) {
      setRecommendedWishes(tripSpot.meta_envies)
    } else {
      setRecommendedWishes([])
    }
    if (currentImages.length > 1) {
      setCarouselImages(currentImages)
    }
  }, [tripSpot])

  const travelersValidation = () => {
    if (
      modalTravelers
        .filter(currentTraveler => !currentTraveler.isNotTraveler)
        .some(currentTraveler => currentTraveler.name.length < 1)
    ) {
      return false
    }
    return true
  }

  const checkRoles = doc => {
    if (!doc.travelersDetails.some(traveler => traveler.id === user.id)) {
      if (!NATURALADMINS.includes(user.id)) {
        history.push('/')
      }
    }
    if (doc.owner === user.id || NATURALADMINS.includes(user.id)) {
      setCanEdit(true)
      setIsAdmin(true)
    } else {
      doc.travelersDetails
        .filter(traveler => traveler.id === user.id)
        .forEach(traveler => {
          switch (traveler.role) {
            case ROLES.Admin:
              setIsAdmin(true)
              setCanEdit(true)
              break
            case ROLES.Write:
              setIsAdmin(false)
              setCanEdit(true)
              break
            default:
              setIsAdmin(false)
              setCanEdit(false)
              history.push('/')
          }
        })
    }
  }

  useEffect(() => {
    firestore
      .collection('trips')
      .doc(tripId)
      .onSnapshot(doc => {
        const tempDoc = doc.data()
        checkRoles(tempDoc)
        setTripData(tempDoc)
      })
    firestore
      .collection('trips')
      .doc(tripId)
      .collection('wishes')
      .onSnapshot(docs => {
        const tempWishes = []
        docs.forEach(doc => tempWishes.push({ ...doc.data(), docId: doc.id }))
        setTripWishes(tempWishes)
      })
  }, [])

  useEffect(() => {
    if (user.isLoggedIn && tripData) {
      checkRoles(tripData)
      setCurrentDestination(tripData.destination)
    }
  }, [user, tripData])

  useEffect(() => {
    if (dictionary.travelers_age) {
      setAgeOptions(dictionary.travelers_age)
    }
  }, [dictionary])

  const checkIsUrlSameAsTab = () => {
    const currentTabFromUrl = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)
    let isUrlSameAsTab = currentTabFromUrl === currentActiveTab
    if (
      ![
        'documents',
        'inspiration',
        'envies',
        'planning',
        'photos',
        'notes',
        'triplogs',
        'tripguide',
      ].includes(currentTabFromUrl) &&
      currentActiveTab === 'preview'
    ) {
      isUrlSameAsTab = true
    }
    return isUrlSameAsTab
  }

  useEffect(() => {
    const currentTabFromUrl = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)
    if (
      ![
        /* 'documents', 'inspiration',  */ 'envies',
        'planning' /* , 'photos'  , 'notes' */,
        'triplogs',
        'tripguide',
      ].includes(currentTabFromUrl)
    ) {
      setCurrentActiveTab('preview')
    } else {
      setCurrentActiveTab(currentTabFromUrl)
    }
  }, [location.pathname])

  useEffect(() => {
    if (currentActiveTab) {
      if (!checkIsUrlSameAsTab()) {
        if (
          currentActiveTab === 'preview' ||
          currentActiveTab === 'documents' ||
          currentActiveTab === 'notes' ||
          currentActiveTab === 'inspiration'
        ) {
          history.push(`/tripPage/${tripId}`)
        } else {
          history.push(`/tripPage/${tripId}/${currentActiveTab}`)
        }
      }
    }
  }, [currentActiveTab])

  useEffect(() => {
    if (tripData) {
      const batchGetUsers = []
      tripData.travelersDetails
        .filter(traveler => traveler?.id)
        .forEach(traveler => {
          if (traveler.id !== user.id) {
            batchGetUsers.push(getUserById(traveler.id))
          }
        })
      Promise.all(batchGetUsers).then(response => {
        if (response.length > 0) {
          const tempTravelers = response.map(({ firstname, id }) => ({ firstname, id }))
          setTripTravelers(tempTravelers)
        }
      })
      setTitle(tripData.title)
      setDescription(tripData.description)
      setCurrentContext(tripData.context)
      setCurrentBudget(tripData.budget)
      setCurrency(tripData.currency)
      setRegisteredTravelers(tripData.travelersDetails)
      setNbTravelers(tripData.travelersDetails.length)
      const tempAvatars = []
      tripData.travelersDetails
        .filter(traveler => traveler.role !== ROLES.Removed)
        .forEach(traveler => {
          if (traveler.id) {
            tempAvatars.push(traveler.id)
          }
        })
      setGeneratedAvatars(tempAvatars)
      if (
        tripData.dateRange &&
        tripData.dateRange.length &&
        tripData.dateRange[0] !== '' &&
        tripData.dateRange[1] !== ''
      ) {
        setCurrentDateRange(rCTFF(tripData.dateRange, 'EEE dd MMMM'))
        setDateRangeForPicker(rCTFF(tripData.dateRange))
      } else {
        setCurrentDateRange(['', ''])
        setDateRangeForPicker(['', ''])
      }
      if (!tripData.noDestination && tripData?.destination?.place_id) {
        getSpotByDestination(tripData?.destination, setTripSpot)
      }
      setIsLoading(false)
    }
    if (tripData?.wishes) {
      tripData.wishes.forEach(userWishes => {
        userWishes.likes.forEach(like => {
          firestore
            .collection('trips')
            .doc(tripId)
            .collection('wishes')
            .add({ ...like, userId: userWishes.userId })
        })
      })
      firestore.collection('trips').doc(tripId).update({
        wishes: fieldValueRef.delete(),
      })
    }
  }, [tripData])

  useEffect(() => {
    setModalTravelers(registeredTravelers)
  }, [registeredTravelers, openModal])

  useEffect(() => {
    setNbTravelers(modalTravelers.filter(traveler => !traveler.isNotTraveler).length)
  }, [modalTravelers])

  const chats = {
    /*     explomaker: {
      description: 'Explomaker',
      participants: ['c0Jn2wGuJAgfybJJT0eZ1we0eK1Q', generatedAvatars[0]],
    }, */
    voyageurs: {
      description: 'Contributeurs',
      participants: generatedAvatars,
    },
  }

  const handleUpdate = data => {
    firestore
      .collection('trips')
      .doc(tripId)
      .set(
        {
          ...data,
        },
        { merge: true }
      )
      .then(() => true)
  }

  const updatePlanning = () => {
    const tripStartDate = dateRangeForPicker[0]
    const tripEndDate = dateRangeForPicker[1]

    const isNotInInterval = arrayOfDates => {
      let tempArrayOfDates = arrayOfDates
      if (!Array.isArray(arrayOfDates)) {
        tempArrayOfDates = [arrayOfDates]
      }
      return tempArrayOfDates.some(date => {
        if (
          !isWithinInterval(rCTFF(date), {
            start: tripStartDate,
            end: tripEndDate,
          })
        ) {
          return true
        }
        return false
      })
    }

    firestore
      .collection('trips')
      .doc(tripId)
      .collection('planning')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let needUpdate = false
          const currentDoc = doc.data()
          // eslint-disable-next-line default-case
          switch (currentDoc.type) {
            case EVENT_TYPES[0]:
              if (currentDoc.isSurvey) {
                currentDoc.propositions.some(currentProposition => {
                  if (isNotInInterval([currentProposition.endTime, currentProposition.startTime])) {
                    needUpdate = true
                    return true
                  }
                  return false
                })
              } else if (isNotInInterval([currentDoc.endTime, currentDoc.startTime])) {
                needUpdate = true
              }
              break
            case EVENT_TYPES[1]:
              if (currentDoc.isSurvey) {
                currentDoc.propositions.some(currentProposition =>
                  currentProposition.flights.some(flight => {
                    if (isNotInInterval(flight.date)) {
                      needUpdate = true
                      return true
                    }
                    return false
                  })
                )
              } else {
                currentDoc.flights.some(flight => {
                  if (isNotInInterval(flight.date)) {
                    needUpdate = true
                    return true
                  }
                  return false
                })
              }
              break
            case EVENT_TYPES[2]:
            case EVENT_TYPES[4]:
              if (currentDoc.isSurvey) {
                currentDoc.propositions.some(currentProposition => {
                  if (isNotInInterval(currentProposition.date)) {
                    needUpdate = true
                    return true
                  }
                  return false
                })
              } else if (isNotInInterval(currentDoc.date)) {
                needUpdate = true
              }
              break
            case EVENT_TYPES[3]:
              if (currentDoc.isSurvey) {
                currentDoc.propositions.some(currentProposition =>
                  currentProposition.transports.some(transport => {
                    if (isNotInInterval([transport.startTime, transport.endTime])) {
                      needUpdate = true
                      return true
                    }
                    return false
                  })
                )
              } else {
                currentDoc.transports.some(transport => {
                  if (isNotInInterval([transport.startTime, transport.endTime])) {
                    needUpdate = true
                    return true
                  }
                  return false
                })
              }
              break
          }
          if (needUpdate) {
            doc.ref.update({
              needNewDates: true,
            })
          }
        })
      })
  }

  if (isLoading) {
    return <Loader />
  }
  return (
    <>
      <Head title={tripData.title} />
      <TripPageNav
        currentActiveTab={currentActiveTab}
        setCurrentActiveTab={setCurrentActiveTab}
        tripId={tripId}
        setOpenModal={setOpenModal}
        openModal={openModal}
        canEdit={canEdit}
        tripData={tripData}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        currentDateRange={currentDateRange}
        currentPlanningNotifications={user?.notifications.filter(
          notification => notification.tripId === tripId && notification.state === 1
        )}
      />
      {canEdit && (
        <>
          <Chat
            isChatOpen={isChatOpen}
            chats={chats}
            tripId={tripId}
            setIsChatOpen={setIsChatOpen}
          />
          <AIChatWindow
            isChatOpen={isChatOpen}
            chats={chats}
            tripId={tripId}
            setIsChatOpen={setIsChatOpen}
          />
        </>
      )}
      <Box
        component="section"
        className={classes.content}
        sx={{
          backgroundColor:
            currentActiveTab === 'Preview'
              ? theme.palette.secondary.contrastText
              : theme.palette.grey.f7,
        }}
      >
        {matchesXs && (
          <Box sx={{ position: 'fixed', top: '15px', right: '15px', zIndex: 999 }}>
            <Button
              variant="outlined"
              sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'white' } }}
              onClick={() => {
                if (!run && !matchesXs) {
                  setState({ run: true })
                }
                if (!mobileRun && matchesXs) {
                  setMobileState({ mobileRun: true })
                }
              }}
            >
              Tutoriel
            </Button>
          </Box>
        )}
        {matchesXs ? (
          <ReactJoyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={mobileRun}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={mobileSteps}
            tooltipComponent={CustomTooltip}
            styles={{
              options: {
                zIndex: 10000000,
                backgroundColor: '#B3E1DD',
                arrowColor: '#B3E1DD',
              },
            }}
          />
        ) : (
          <ReactJoyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            tooltipComponent={CustomTooltip}
            styles={{
              options: {
                zIndex: 10000,
                backgroundColor: '#B3E1DD',
                arrowColor: '#B3E1DD',
              },
            }}
          />
        )}

        <Box
          className={classes.innerContent}
          sx={{
            position: 'relative',
            padding: '0 0 0 350px',
            margin: '0 auto',

            '@media (max-width: 1600px)': {
              maxWidth: '100%',
              // padding: '0 20px 0 380px',
              padding: '0 0 0 350px',
            },
            '@media (max-width: 1060px)': {
              // padding: '0 15px 0 260px',
              padding: '0 0 0 240px',
            },
            '@media (max-width: 840px)': {
              padding: '0 15px 0',
            },
            '@media (max-width: 600px)': {
              padding: '0',
              width: '100%',
            },
            [theme.breakpoints.down('sm')]: {
              padding: '0',
            },
          }}
        >
          <Box
            px={currentActiveTab === 'planning' ? '0' : matchesXs ? '0' : '0'}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            minHeight="100vh"
          >
            <Box>
              {/* TODO intégrer le planningContext */}
              {currentActiveTab === 'preview' && (
                <Box
                  sx={{
                    [theme.breakpoints.down('sm')]: {
                      minHeight: '100vh',
                    },
                  }}
                  className={classes.previewContainer}
                >
                  <Preview
                    tripData={tripData}
                    setOpenModal={setOpenModal}
                    canEdit={canEdit}
                    carouselImages={carouselImages}
                    tripId={tripId}
                    run={run}
                    setState={setState}
                    mobileRun={mobileRun}
                    setMobileState={setMobileState}
                    isAdmin={isAdmin}
                  />
                </Box>
              )}
              {currentActiveTab === 'envies' && (
                <Envies
                  tripId={tripId}
                  tripWishes={tripWishes}
                  recommendedWishes={recommendedWishes}
                  canEdit={canEdit}
                  tripTravelers={tripTravelers}
                />
              )}
              {currentActiveTab === 'planning' && (
                <PlanningContextProvider>
                  <Planning
                    tripData={tripData}
                    setTripData={setTripData}
                    tripId={tripId}
                    canEdit={canEdit}
                  />
                </PlanningContextProvider>
              )}
              {currentActiveTab === 'triplogs' && (
                <TripLogs tripData={tripData} tripId={tripId} canEdit={canEdit} />
              )}
              {currentActiveTab === 'tripguide' && <TripGuide />}
              {/* {currentActiveTab === 'photos' && <Photos tripId={tripId} />} */}
              {/* {currentActiveTab === 'documents' && <Documents />}
            {currentActiveTab === 'notes' && <Notes />}
            {currentActiveTab === 'inspiration' && <Inspiration />} */}
            </Box>
            {(currentActiveTab === 'photos' ||
              currentActiveTab === 'documents' ||
              currentActiveTab === 'notes') && (
              <Box position="relative">
                <Box
                  position={matchesXs ? 'fixed' : 'absolute'}
                  right={matchesXs ? '50%' : matches1600 ? '-35px' : '-15px'}
                  bottom={matchesXs ? '110px' : matches1600 ? '85px' : '20px'}
                  sx={{ transform: matchesXs ? 'translate(50%, 0)' : 'none' }}
                >
                  <Fab
                    color="primary"
                    aria-label={`add ${currentActiveTab}`}
                    onClick={() => setOpenModal(`add-${currentActiveTab}`)}
                    className={classes.fab}
                  >
                    <Add />
                  </Fab>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <TripPageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalName="general"
        hasValidation={false}
      >
        <Paper className={classes.rowPaper} variant="outlined">
          <Box mx={3} display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Typography className={classes.modificationTitle}>Titre du séjour</Typography>
              <Typography className={classes.modificationTitleData}>{tripData.title}</Typography>
            </Box>
            <IconButton
              onClick={() => setOpenModal('editTitle')}
              size="large"
              sx={{ padding: '0' }}
            >
              <img src={matchesXs ? arrow : pencil} alt="" />
            </IconButton>
          </Box>
        </Paper>
        <Paper className={classes.rowPaper} variant="outlined">
          <Box mx={3} display="flex" justifyContent="space-between">
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Typography className={classes.modificationTitle}>Destination</Typography>
              <Typography className={classes.modificationTitleData}>
                {!tripData.noDestination && tripData.destination.label}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setOpenModal('editDestination')}
              size="large"
              sx={{ padding: '0' }}
            >
              <img src={matchesXs ? arrow : pencil} alt="" />
            </IconButton>
          </Box>
        </Paper>
        {matchesXs ? (
          <Paper className={classes.rowPaper} variant="outlined">
            <Box mx={3} display="flex" justifyContent="space-between">
              <Box display="flex" flexDirection="column" justifyContent="center">
                <Typography className={classes.modificationTitle}>Dates</Typography>
                <Box display="flex">
                  <Typography className={classes.modificationTitleData}>
                    {currentDateRange[0]}
                  </Typography>
                  <Typography className={classes.betweenDates}>-</Typography>
                  <Typography className={classes.modificationTitleData}>
                    {currentDateRange[1]}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setOpenModal('editDate')}
                size="large"
                sx={{ padding: '0' }}
              >
                <img src={matchesXs ? arrow : pencil} alt="" />
              </IconButton>
            </Box>
          </Paper>
        ) : (
          <Paper className={classes.rowPaper} variant="outlined">
            <Box mx={3} display="flex" justifyContent="space-between">
              <Box display="flex" flexDirection="column" justifyContent="center">
                <Typography className={classes.modificationTitle}>Arrivée</Typography>
                <Typography className={classes.modificationTitleData}>
                  {currentDateRange[0]}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Divider className={classes.dividerDeparture} orientation="vertical" />
                <Box display="flex" flexDirection="column" ml={3} justifyContent="center">
                  <Typography className={classes.modificationTitle}>Départ</Typography>
                  <Typography className={classes.modificationTitleData}>
                    {currentDateRange[1]}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setOpenModal('editDate')}
                size="large"
                sx={{ padding: '0' }}
              >
                <img src={matchesXs ? arrow : pencil} alt="" />
              </IconButton>
            </Box>
          </Paper>
        )}
        <Paper className={classes.rowPaper} variant="outlined">
          <Box mx={3} display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography
                sx={{
                  marginBottom: '0',
                  color: theme.palette.grey.black,
                  fontSize: '17px',
                  fontFamily: theme.typography.h1.fontFamily,
                  [theme.breakpoints.down('sm')]: {
                    color: theme.palette.primary.main,
                    fontFamily: theme.typography.fontFamily,
                    fontSize: '14px',
                  },
                }}
              >
                Contributeurs
              </Typography>
              {matchesXs && <CustomAvatar peopleIds={generatedAvatars} />}
            </Box>
            <Box display="flex" alignItems="center">
              {!matchesXs && <CustomAvatar peopleIds={generatedAvatars} />}
              <Box ml={2}>
                <IconButton
                  onClick={() => setOpenModal('editEditors')}
                  size="large"
                  sx={{ padding: '0' }}
                >
                  <img src={matchesXs ? arrow : pencil} alt="" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Paper>
        <Paper className={classes.rowPaper} variant="outlined">
          <Box mx={3} display="flex" justifyContent="space-between">
            <Box display="flex" flexDirection="column" justifyContent="center">
              <Typography className={classes.modificationTitle}>Devise par défaut</Typography>
              <Typography className={classes.modificationTitleData}>
                {tripData &&
                  CURRENCIES.filter(
                    currentCurrency => currentCurrency.value === tripData.currency
                  )[0].label}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setOpenModal('editCurrency')}
              size="large"
              sx={{ padding: '0' }}
            >
              <img src={matchesXs ? arrow : pencil} alt="" />
            </IconButton>
          </Box>
        </Paper>
      </TripPageModal>
      <TripPageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalName="editTitle"
        modalBack
        submitHandler={() => {
          handleUpdate({ title: title.trim() })
          setOpenModal('general')
        }}
        preventCloseOnSubmit
        isValid={title.trim().length <= 40 && title.trim().length > 0}
      >
        <Typography className={classes.textFieldTitle}>Titre du séjour</Typography>
        <TextField
          InputProps={{ className: classes.textField }}
          hiddenLabel
          type="text"
          variant="filled"
          value={title}
          onChange={event => setTitle(event.target.value)}
          fullWidth
        />
        {title.trim().length > 40 && (
          <Box
            display="flex"
            alignItems="center"
            mt={1}
            p={2}
            bgcolor="secondary.ultraLight"
            borderRadius="10px"
          >
            <Info color="secondary" />
            <Box ml={1} mb={matchesXs ? 1 : 0}>
              <Typography variant="body2">Maximum 40 caractères</Typography>
            </Box>
          </Box>
        )}
      </TripPageModal>
      <TripPageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalName="editDestination"
        modalBack
        submitHandler={async () => {
          const results = await geocodeByPlaceId(currentDestination.value.place_id)
          const latLng = await getLatLng(results[0])
          const { lat: latitude, lng: longitude } = latLng
          handleUpdate({
            latitude,
            longitude,
            destination: {
              ...currentDestination,
              ...(currentDestination.shortCountryName
                ? {
                    label: currentDestination.label,
                    place_id: currentDestination.value.place_id,
                    shortCountryName: currentDestination.shortCountryName,
                  }
                : {
                    label: currentDestination.label,
                    place_id: currentDestination.value.place_id,
                  }),
            },
            noDestination: false,
          })
          createNotificationsOnTrip(user, tripData, tripId, 'destinationUpdate', 3)
          setOpenModal('general')
        }}
        isValid={!!currentDestination?.value?.place_id}
        preventCloseOnSubmit
        hasNotOverflowY={!matchesXs}
      >
        <Box>
          <Box
            className={classes.infoContainer}
            sx={{ [theme.breakpoints.down('sm')]: { marginTop: theme.spacing(3) } }}
          >
            <Box>
              <Info color="primary" />
            </Box>
            <Typography>
              Pour la destination, tu peux rechercher un continent, un pays, une région, une ville,
              un lieu&nbsp;...
            </Typography>
          </Box>
          {matchesXs ? (
            <Box sx={{ minHeight: '45vh' }}>
              <GooglePlacesAutocomplete value={currentDestination} setter={setCurrentDestination} />
            </Box>
          ) : (
            <GooglePlacesAutocomplete value={currentDestination} setter={setCurrentDestination} />
          )}
          {false && (
            <Box>
              <img src={flat} alt="" />
              <Typography>République du Kenya (KEN)</Typography>
              <Typography>En quelques mots</Typography>
              <Typography>
                Envie d’une escapade dans la savane, de relaxation sur une plage de sable blanc, ou
                des deux ? Le Kenya saura t’offrir les vacances dont tu rêves. Après un passage à
                Nairobi, capitale dynamique tant sur le plan culturel qu’économique, et qui vaut la
                peine de s’arrêter, va pister les animaux emblématiques de l’Afrique et pars à la
                rencontre du peuple maasaï. , va pister les animaux emblématiques de l’Afrique et
                pars à la rencontre du peuple maasaï., va pister les animaux emblématiques de
                l’Afrique et pars à la rencontre du peuple maasaï. , va pister les animaux
                emblématiques de l’Afrique et pars à la rencontre du peuple maasaï.
              </Typography>
            </Box>
          )}
        </Box>
      </TripPageModal>
      <TripPageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalName="editDate"
        modalBack
        submitHandler={() => {
          handleUpdate({
            dateRange: dateRangeForPicker?.length
              ? [
                  new timestampRef.fromDate(dateRangeForPicker[0]),
                  new timestampRef.fromDate(dateRangeForPicker[1]),
                ]
              : null,
          })
          updatePlanning()
          setOpenModal('general')
          setAllowCreateDateNotif(true)
        }}
        preventCloseOnSubmit
        contentMinHeight="470px"
      >
        <Typography className={classes.modaltitles}>
          {matchesXs ? 'Dates' : 'Dates du séjour'}
        </Typography>
        <DateRangePicker value={dateRangeForPicker} setter={setDateRangeForPicker} />
        {tripSpot?.periode_visite && !tripData.noDestination && (
          <DateRangesBar
            destination={tripSpot ? tripSpot?.title : tripData?.destination?.label}
            bestPeriods={tripSpot.periode_visite}
            linkWord={tripSpot.link_words[1]}
          />
        )}
        <Box className={clsx(classes.infoContainer, classes.warningContainer)}>
          <Box>
            <Info color="secondary" />
          </Box>
          <Typography>
            En modifiant tes dates de séjour, les évènements dans ton planning qui
            n&apos;appartiennent pas à la plage de ton voyage devront être replanifiés.
          </Typography>
        </Box>
      </TripPageModal>
      <TripPageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalName="editEditors"
        modalBack
        submitHandler={() => setOpenModal('general')}
        preventCloseOnSubmit
        title="Contributeurs"
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            backgroundColor: 'theme.palette.primary.ultraLight',
            borderRadius: '10px',
            marginTop: matchesXs && '10px',
          }}
        >
          <Box sx={{ marginRight: '10px' }}>
            <Info color="primary" />
          </Box>
          <Typography variant="body2">
            Tous les contributeurs peuvent voir et modifier le séjour
          </Typography>
        </Box>
        {isShowingRemovedContributors
          ? matchesXs
            ? currentTravelers.map(singleTravelerDetails => (
                <MobileEditEditorGrid
                  singleTravelerDetails={singleTravelerDetails}
                  isAdmin={isAdmin}
                  updateTrip={updateTrip}
                />
              ))
            : currentTravelers.map(singleTravelerDetails => (
                <DesktopEditEditorGrid
                  singleTravelerDetails={singleTravelerDetails}
                  isAdmin={isAdmin}
                  updateTrip={updateTrip}
                />
              ))
          : matchesXs
          ? currentTravelers
              .filter(traveler => traveler.role !== ROLES.Removed)
              .map(singleTravelerDetails => (
                <MobileEditEditorGrid
                  singleTravelerDetails={singleTravelerDetails}
                  isAdmin={isAdmin}
                  updateTrip={updateTrip}
                />
              ))
          : currentTravelers
              .filter(traveler => traveler.role !== ROLES.Removed)
              .map(singleTravelerDetails => (
                <DesktopEditEditorGrid
                  singleTravelerDetails={singleTravelerDetails}
                  isAdmin={isAdmin}
                  updateTrip={updateTrip}
                />
              ))}
        {isAdmin && tripData.travelersDetails.some(traveler => traveler.role === ROLES.Removed) && (
          <FormControlLabel
            label="Montrer les contributeurs retirés"
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
            control={
              <Checkbox
                checked={isShowingRemovedContributors}
                onChange={event => {
                  setIsShowingRemovedContributors(event.target.checked)
                }}
              />
            }
          />
        )}
        {canEdit && (
          <>
            <Box
              display="flex"
              alignItems="center"
              sx={{ marginTop: '15px', display: 'flex', alignItems: 'center' }}
            >
              <Box sx={{ marginRight: '15px' }}>
                <AddCollaboratorsButton tripId={tripId} isEditorModal />
              </Box>
              <Typography>Inviter un nouveau contributeur</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                className={classes.btnCopyContainer}
                variant="outlined"
                startIcon={<FileCopyRoundedIcon color="primary" />}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://${window.location.href.split('/')[2]}/join/${tripId}`
                  )
                  toast.success('Lien copié !')
                }}
              >
                {matchesXs ? (
                  <Typography className={classes.typoCopyBtn}>
                    Copier lien d&apos;invitation
                  </Typography>
                ) : (
                  <Typography className={classes.typoCopyBtn}>LIEN D&apos;INVITATION</Typography>
                )}
              </Button>
            </Box>
          </>
        )}
      </TripPageModal>
      <TripPageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalName="editInfo"
        submitHandler={() => handleUpdate({ context: currentContext, budget: currentBudget })}
      >
        <Typography className={classes.infoTitles} component="h5">
          Contexte
        </Typography>
        <Box mt={2}>
          <FormControl component="fieldset" required>
            <RadioGroup row aria-label="Contexte" name="Contexte">
              {CONTEXT_OPTIONS.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio classes={{ root: classes.radio }} />}
                  label={
                    <Button
                      color={currentContext === option.value ? 'primary' : 'inherit'}
                      variant="contained"
                      className={classes.roundedBtn}
                      onClick={() => setCurrentContext(option.value)}
                      disableElevation
                    >
                      {option.label}
                    </Button>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
        <Box mt={4}>
          <Typography component="h5" className={classes.infoTitles}>
            Budget
          </Typography>
          <Box mt={2}>
            <FormControl component="fieldset" required>
              <RadioGroup row aria-label="budget" name="budget">
                {BUDGET_OPTIONS.map(option => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio classes={{ root: classes.radio }} />}
                    label={
                      <Button
                        color={currentBudget === option.value ? 'primary' : 'inherit'}
                        variant="contained"
                        className={classes.roundedBtn}
                        onClick={() => setCurrentBudget(option.value)}
                        disableElevation
                      >
                        {option.label}
                      </Button>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
      </TripPageModal>
      <TripPageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalName="editDescription"
        submitHandler={() => handleUpdate({ description })}
      >
        <Typography className={classes.textFieldTitle}>Le projet</Typography>
        <TextareaAutosize
          className={classes.textarea}
          type="text"
          placeholder="Le projet"
          value={description}
          onChange={event => setDescription(event.target.value)}
          minRows={6}
          maxRows={30}
        />
        <Box className={classes.infoTripDescriptionContainer}>
          <Info
            color="primary"
            sx={{
              marginRight: '15px',
              fontSize: '30px',
              [theme.breakpoints.down('sm')]: {
                marginBottom: '10px',
                justifySelf: 'flex-start',
              },
            }}
          />
          <Typography align={matchesXs ? 'center' : 'left'}>
            Présentez le projet à vos covoyageurs et invitez les à prendre part au voyage dès à
            présent ! Destinations, esprit du week-end, qui participe... A vous de jouer !
          </Typography>
        </Box>
      </TripPageModal>
      <TripPageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        isValid={travelersValidation()}
        modalName="editTravelers"
        title={matchesXs ? 'Les voyageurs' : 'Modification'}
        submitHandler={() =>
          handleUpdate({
            travelersDetails: modalTravelers
              .filter(traveler => !traveler.isNotTraveler)
              .map(traveler => {
                const tempTraveler = traveler
                const filteredTraveler = filterObjectByValue(tempTraveler, undefined, true)
                return filteredTraveler
              }),
          })
        }
      >
        <Box sx={{ padding: matchesXs && '30px 0' }}>
          {!matchesXs && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography className={classes.travelersCountTitle}>Voyageurs</Typography>{' '}
              <IconButton
                onClick={() => {
                  if (nbTravelers < 15)
                    setModalTravelers([...modalTravelers, { ...initialTraveler() }])
                }}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  width: '44px',
                  height: '44px',
                  borderRadius: '50px',
                  zIndex: 1000,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                  },
                  border: '2px solid white',
                }}
              >
                <PersonAddAlt1 sx={{ color: 'white', fontSize: '26px' }} />
              </IconButton>
            </Box>
          )}
          <Box marginBottom={matchesXs ? '20px' : '89px'}>
            {modalTravelers
              // .filter(currentTraveler => !currentTraveler.isNotTraveler)
              // .filter(currentTraveler => currentTraveler.role !== ROLES.Removed)
              .map((currentTraveler, index) => {
                if (!currentTraveler.isNotTraveler && currentTraveler.role !== ROLES.Removed) {
                  return (
                    <TravelerRow
                      key={currentTraveler.travelerId}
                      traveler={currentTraveler}
                      ageOptions={ageOptions}
                      setModalTravelers={setModalTravelers}
                      index={index}
                      nbTravelers={nbTravelers}
                      modalTravelers={modalTravelers}
                    />
                  )
                }
                return null
              })}
          </Box>
        </Box>
      </TripPageModal>
      <TripPageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalName="editCurrency"
        modalBack
        submitHandler={() => {
          handleUpdate({ currency })
          setOpenModal('general')
        }}
        preventCloseOnSubmit
      >
        <Typography className={classes.modaltitles}>Devise par défaut</Typography>
        <FormControl variant="outlined" fullWidth>
          <Select
            MenuProps={{ sx: { zIndex: '100000' } }}
            hiddenLabel
            variant="filled"
            value={currency}
            onChange={event => setCurrency(event.target.value)}
          >
            {CURRENCIES.map(currentCurrency => (
              <MenuItem key={currentCurrency.value} value={currentCurrency.value}>
                {currentCurrency.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TripPageModal>
      <TripPageModal openModal={openModal} setOpenModal={setOpenModal} modalName="add-photos">
        <div>
          <input
            required
            id="file-upload-input"
            multiple
            type="file"
            accept="image/*"
            onChange={event => setUplodedPhotos([...event.target.files])}
          />
          <div>
            <IconButton size="large">
              <AddAPhoto />
            </IconButton>
            <Typography>Importe ou glisse ton image ici</Typography>
            <Typography variant="body2">Formats supportés : jpg, png</Typography>
          </div>
        </div>
        <div>
          <div>
            <div>
              <div>
                <div>Photo téléchargée !</div>
              </div>
              <IconButton onClick={() => setUplodedPhotos([])} size="large">
                <Delete />
              </IconButton>
            </div>
            <div>
              <div>Description</div>
              <input type="text" placeholder="Description de la photo" />
            </div>
          </div>
        </div>
      </TripPageModal>
      <TripPageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalName="add-notes"
        title="Créer une note"
        hasValidation={false}
      >
        <Typography variant="h5">Titre</Typography>
        <input required type="text" placeholder="Titre de la note" />
        <div>
          <div>Participants concernés</div>
          <div>
            <label htmlFor="1">
              <input type="checkbox" name="1" id="1" />
              <div>
                <span>Fabien Frossard</span>
                <img src={ava1} alt="" />
              </div>
            </label>
            <label htmlFor="2">
              <input type="checkbox" name="2" id="2" />
              <div>
                <span>Fabien Frossard</span>
                <img src={ava2} alt="" />
              </div>
            </label>
            <label htmlFor="3">
              <input type="checkbox" name="3" id="3" />
              <div>
                <span>Fabien Frossard</span>
                <img src={ava3} alt="" />
              </div>
            </label>
            <label htmlFor="4">
              <input type="checkbox" name="4" id="4" />
              <div>
                <span>Fabien Frossard</span>
                <img src={ava4} alt="" />
              </div>
            </label>
          </div>
        </div>
        <div>
          <div>Partager le document avec :</div>
          <div>
            <label htmlFor="checkmark1">
              <input type="checkbox" />
              <span />
            </label>
            <div>Damien Clochard</div>
          </div>
          <div>
            <label htmlFor="checkmark2">
              <input type="checkbox" />
              <span />
            </label>
            <div>Julie Dupont</div>
          </div>
          <div>
            <label htmlFor="checkmark3">
              <input type="checkbox" />
              <span />
            </label>
            <div>Fabien Frossard</div>
          </div>
          <div>
            <label htmlFor="checkmark4">
              <input type="checkbox" />
              <span />
            </label>
            <div>Mélanie Lemaître</div>
          </div>
        </div>
        <div>
          <a href="#d">Créer la note</a>
          <a href="#d">Créer la note</a>
        </div>
      </TripPageModal>
      <TripPageModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalName="add-docs"
        title="Ajouter un document"
      >
        <div>
          <input
            id="file-upload-input"
            multiple
            type="file"
            onChange="readURL(this);"
            accept=".doc,.pdf,.txt,.xlsx,.docx"
          />
          <div>
            <IconButton size="large">
              <Camera />
            </IconButton>
            <Typography>Importe ou glisse ton document ici</Typography>
            <Typography variant="body2">Formats supportés : pdf, txt, xls, word</Typography>
          </div>
        </div>
        <div>
          <div>
            <a href="#d">Anuler</a>
            <a href="#d">Ajouter</a>
          </div>
          <div>
            <div>
              <input type="text" placeholder="Titre du document" />
            </div>
            <div>Document sélectionné :</div>
            <div>
              <div>
                <div>Photo téléchargée !</div>
              </div>
              <div>
                <IconButton size="large">
                  <Close />
                </IconButton>
              </div>
            </div>
            <div>
              <div>Titre</div>
              <div>
                <input type="text" placeholder="Titre du document" />
              </div>
            </div>
            <div>
              <div>Icône :</div>
              <div>
                <label htmlFor="plane">
                  <input checked type="radio" name="gender" id="plane" />
                  <div>Activitée</div>
                  <span className="icon-plane" />
                </label>
                <label htmlFor="bed">
                  <input type="radio" name="gender" id="bed" />
                  <span className="icon-bed" />
                  <div>Activitée</div>
                </label>
                <label htmlFor="box">
                  <input type="radio" name="gender" id="box" />
                  <span className="icon-box" />
                  <div>Activitée</div>
                </label>
                <label htmlFor="partir">
                  <input type="radio" name="gender" id="partir" />
                  <span className="icon-doc" />
                  <div>Activitée</div>
                </label>
              </div>
            </div>
            <div>
              <div>Participants concernés</div>
              <div>
                <label htmlFor="1">
                  <input checked type="checkbox" name="1" id="1" />
                  <div>
                    <span>Fabien Frossard</span>
                    <img src={ava1} alt="" />
                  </div>
                </label>
                <label htmlFor="2">
                  <input type="checkbox" name="2" id="2" />
                  <div>
                    <span>Fabien Frossard</span>
                    <img src={ava2} alt="" />
                  </div>
                </label>
                <label htmlFor="3">
                  <input type="checkbox" name="3" id="3" />
                  <div>
                    <span>Fabien Frossard</span>
                    <img src={ava3} alt="" />
                  </div>
                </label>
                <label htmlFor="4">
                  <input type="checkbox" name="4" id="4" />
                  <div>
                    <span>Fabien Frossard</span>
                    <img src={ava4} alt="" />
                  </div>
                </label>
              </div>
            </div>
            <div>
              <div>Partager le document avec :</div>
              <div>
                <label htmlFor="checkmark10">
                  <input type="checkbox" />
                  <span />
                </label>
                <div>Damien Clochard</div>
              </div>
              <div>
                <label htmlFor="checkmark11">
                  <input type="checkbox" />
                  <span />
                </label>
                <div>Julie Dupont</div>
              </div>
              <div>
                <label htmlFor="checkmark12">
                  <input type="checkbox" />
                  <span />
                </label>
                <div>Fabien Frossard</div>
              </div>
              <div>
                <label htmlFor="checkmark13">
                  <input type="checkbox" />
                  <span />
                </label>
                <div>Mélanie Lemaître</div>
              </div>
            </div>
          </div>
        </div>
      </TripPageModal>
      {/* {canEdit && !matchesXs && (
        <Box
          display={matchesXs ? 'block' : 'none'}
          className={clsx(classes.chatBtn, {
            [classes.chatBtnOpen]: isChatOpen && !matchesXs,
            [classes.chatBtnClose]: !isChatOpen,
          })}
        >
          <Fab color="primary" onClick={() => setIsChatOpen(!isChatOpen)} className={classes.fab}>
            <ForumRounded />
          </Fab>
        </Box>
      )} */}
      {canEdit && !matchesXs && <SocialNavbar />}
    </>
  )
}

export default TripPage

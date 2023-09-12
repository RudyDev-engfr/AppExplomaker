import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@mui/styles'
import { useHistory } from 'react-router-dom'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import EventNoteIcon from '@mui/icons-material/EventNote'
/* import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined' */
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Paper from '@mui/material/Paper'
import Slide from '@mui/material/Slide'
import Tab from '@mui/material/Tab'
import Badge from '@mui/material/Badge'
import Tabs from '@mui/material/Tabs'
import useMediaQuery from '@mui/material/useMediaQuery'
import clsx from 'clsx'
import FeedIcon from '@mui/icons-material/Feed'
import AirplanemodeActiveRounded from '@mui/icons-material/AirplanemodeActiveRounded'
import DirectionsBusFilled from '@mui/icons-material/DirectionsBusFilled'
import ExploreRounded from '@mui/icons-material/ExploreRounded'
import HomeRounded from '@mui/icons-material/HomeRounded'
import Logout from '@mui/icons-material/Logout'
import Explore from '@mui/icons-material/Explore'
import RestaurantMenuRounded from '@mui/icons-material/RestaurantMenuRounded'
import Forum from '@mui/icons-material/Forum'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import logoFull from '../../../images/icons/logoFull.svg'
// import planning from '../../../images/icons/planning.svg'
// import planningGreen from '../../../images/icons/planningGreen.svg'
// /* import photo from '../../../images/icons/photo.svg'
// import photoGreen from '../../../images/icons/photoGreen.svg' */
// import plus from '../../../images/icons/plus.svg'
// import plusGreen from '../../../images/icons/plusGreen.svg'
// import apercu from '../../../images/icons/apercu.svg'
// import apercuGreen from '../../../images/icons/apercuGreen.svg'
import MobilePlus from './MobilePlus'
import TitleArea from './TitleArea'

import { TripContext } from '../../../contexts/trip'
import FabDial from '../../../components/atoms/FabDial'
import { EVENT_TYPES } from '../../../helper/constants'
import MobileNotificationArea, {
  MobileNotificationModal,
} from '../../../components/molecules/MobileNotificationArea'
import { FirebaseContext } from '../../../contexts/firebase'
import { SessionContext } from '../../../contexts/session'
import { buildNotificationsOnTripForUser } from '../../../helper/functions'

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />)

const useStyles = makeStyles(theme => ({
  container: {
    position: 'fixed',
    borderRadius: '0',
    top: '0',
    left: '0',
    height: '100vh',
    width: '350px',
    zIndex: '1',
    display: 'grid',
    gridTemplate: 'min-content max-content 1fr min-content / 1fr',
    '@media (max-width: 1060px)': {
      width: '240px',
    },
  },
  sidebarButton: {
    padding: '15px 50px 15px 20px',
    display: 'flex',
    alignItems: 'center',
    color: '#000000',
    textTransform: 'unset',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderRadius: '25px 0 0 25px',
    transition: '0.2s background-color linear',
    justifyContent: 'flex-start',
    position: 'relative',
    left: '30px',
    width: 'calc(100% - 30px)',
    '&:hover': {
      background: '#f7f7f7',
      color: '#009d8c',
    },
    '@media (max-width: 1060px)': {
      paddingLeft: '15px',
      left: '0',
      width: '100%',
    },
  },
  activeTabStyle: {
    position: 'relative',
    left: '30px',
    background: '#f7f7f7',
    color: '#009d8c',
    borderRadius: '25px 0 0 25px',
    paddingLeft: '20px',
    '&::before': {
      content: `""`,
      width: '10px',
      top: '0',
      left: '-30px',
      borderRadius: '0 25px 25px 0',
      height: '100%',
      backgroundColor: '#009d8c',
      position: 'absolute',
    },
    '@media (max-width: 1060px)': {
      left: '0',
      paddingLeft: '15px',
      '&::before': {
        left: '0',
      },
    },
  },
  returnButton: {
    padding: '15px 50px',
    color: '#000000',
    textTransform: 'unset',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderRadius: '0 25px 25px 0',
    position: 'relative',
    transition: '0.2s background-color linear',
    '&:hover': {
      left: '0',
      background: '#f7f7f7',
      color: '#009d8c',
    },
    '@media (max-width: 1060px)': {
      padding: '15px',
    },
  },
  icons: {
    fontSize: '1.5rem!important',
    position: 'relative',
    top: '-.05rem',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  xsNav: {
    backgroundColor: 'white',
    position: 'fixed',
    bottom: '0',
    width: '100%',
    height: '80px',
    padding: `0 4px 12px 4px !important`,
    zIndex: '10000',
  },
  // spanNav: {
  //   color: 'rgba(79, 79, 79, 0.5)',
  //   fontSize: '9px',
  //   fontWeight: '800',
  // },
  // activeMobileTabStyle: {
  //   color: theme.palette.primary.main,
  // },
}))

const TripPageNav = ({
  currentActiveTab,
  setCurrentActiveTab,
  tripId,
  tripData,
  currentDateRange,
  currentPlanningNotifications,
  canEdit,
  setOpenModal,
  openModal,
  isChatOpen,
  setIsChatOpen,
}) => {
  const history = useHistory()
  const classes = useStyles()
  const matches1060 = useMediaQuery('(max-width:1060px)')
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { setTypeCreator, updateHasSeen, setItemData, setCurrentSelectedTripGuideButton } =
    useContext(TripContext)
  const { setNotificationsToNewStateOnTrip, firestore } = useContext(FirebaseContext)
  const { user } = useContext(SessionContext)

  const [isMobilePlusOpen, setIsMobilePlusOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [refreshNotif, setRefreshNotif] = useState(false)
  const [currentNotifications, setCurrentNotifications] = useState([])

  const messagesRef = firestore.collection('trips').doc(tripId).collection('messages')
  const assistantRef = firestore.collection('trips').doc(tripId).collection('Assistant')
  const assistantQuery = assistantRef.orderBy('createdAt')
  const query = messagesRef.orderBy('createdAt')
  const [messages] = useCollectionData(query, { idField: 'messageId' })
  const [assistantMessages] = useCollectionData(assistantQuery, { idField: 'AssistantId' })

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleMobileNavigation = target => {
    if (isMobilePlusOpen) {
      setIsMobilePlusOpen(false)
    }
    setCurrentActiveTab(target)
  }

  useEffect(() => {
    if (tripData && user && refreshNotif) {
      const tempNotif = buildNotificationsOnTripForUser(user, tripId)
      setCurrentNotifications(tempNotif)
      setRefreshNotif(false)
    }
    console.log('le voyage avec ses notifs', user.notifications)
  }, [tripData, user, refreshNotif])

  const addActions = [
    {
      icon: <HomeRounded />,
      name: 'Hébergement',
      callback: setTypeCreator(EVENT_TYPES[0]),
    },
    { icon: <AirplanemodeActiveRounded />, name: 'Vols', callback: setTypeCreator(EVENT_TYPES[1]) },
    { icon: <DirectionsBusFilled />, name: 'Transports', callback: setTypeCreator(EVENT_TYPES[3]) },
    {
      icon: <RestaurantMenuRounded />,
      name: 'Restaurant',
      callback: setTypeCreator(EVENT_TYPES[4]),
    },
    { icon: <ExploreRounded />, name: 'Exploration', callback: setTypeCreator(EVENT_TYPES[2]) },
  ]

  return !isXs ? (
    <Paper className={classes.container}>
      <Box p={matches1060 ? '15px 15px 10px 15px' : '50px 50px 35px 50px'}>
        <img src={logoFull} alt="" />
      </Box>
      <TitleArea
        tripDestinationLabel={tripData.destination?.label}
        tripTitle={tripData.title}
        tripDateRange={currentDateRange}
        canEdit={canEdit}
        setOpenModal={setOpenModal}
      />
      <Box display="flex" flexDirection="column" sx={{ height: 'fit-content' }}>
        <Button
          className={clsx(classes.sidebarButton, {
            [classes.activeTabStyle]: currentActiveTab === 'preview',
          })}
          onClick={() => setCurrentActiveTab('preview')}
          startIcon={
            <DashboardOutlinedIcon
              color={currentActiveTab === 'preview' ? 'primary' : 'disabled'}
              className={classes.icons}
            />
          }
        >
          Aperçu
        </Button>
        <Button
          className={clsx(classes.sidebarButton, {
            [classes.activeTabStyle]: currentActiveTab === 'envies',
          })}
          onClick={() => setCurrentActiveTab('envies')}
          startIcon={
            <StarBorderIcon
              color={currentActiveTab === 'envies' ? 'primary' : 'disabled'}
              className={classes.icons}
            />
          }
        >
          Envies
        </Button>
        <Box className="planningPage-desktop">
          <Button
            className={clsx(classes.sidebarButton, {
              [classes.activeTabStyle]: currentActiveTab === 'planning',
            })}
            onClick={() => {
              history.push(`/tripPage/${tripId}/planning`)
            }}
            startIcon={
              <EventNoteIcon
                color={currentActiveTab === 'planning' ? 'primary' : 'disabled'}
                className={classes.icons}
              />
            }
            sx={{ position: 'relative' }}
          >
            Planning
            {currentPlanningNotifications.filter(notification => notification.state === 1).length >
              0 && (
              <Box
                sx={{
                  position: 'absolute',
                  backgroundColor: theme.palette.secondary.main,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50px',
                  padding: '5px',
                  right: '25px',
                  zIndex: 1000000,
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: 500,
                  lineHeight: '10.67px',
                }}
              >
                {
                  currentPlanningNotifications.filter(notification => notification.state === 1)
                    .length
                }
              </Box>
            )}
          </Button>
        </Box>
        {!tripData.noDestination && (
          <Box className="guidePage-desktop">
            <Button
              className={clsx(classes.sidebarButton, {
                [classes.activeTabStyle]: currentActiveTab === 'tripguide',
              })}
              onClick={() => {
                setCurrentActiveTab('tripguide')
                setCurrentSelectedTripGuideButton(null)
                setItemData(null)
              }}
              startIcon={
                <FeedIcon
                  color={currentActiveTab === 'tripguide' ? 'primary' : 'disabled'}
                  className={classes.icons}
                />
              }
            >
              Guide
            </Button>
          </Box>
        )}
        {canEdit && (
          <Button
            className={clsx(classes.sidebarButton, {
              [classes.activeTabStyle]: currentActiveTab === 'triplogs',
            })}
            onClick={() => setCurrentActiveTab('triplogs')}
            startIcon={
              <FeedIcon
                color={currentActiveTab === 'triplogs' ? 'primary' : 'disabled'}
                className={classes.icons}
              />
            }
          >
            Logs
          </Button>
        )}
        {/* <Button
              className={clsx(classes.sidebarButton, {
                [classes.activeTabStyle]: currentActiveTab === 'photos',
              })}
              onClick={() => setCurrentActiveTab('photos')}
              startIcon={
                <PhotoCameraOutlinedIcon
                  color={currentActiveTab === 'photos' ? 'primary' : 'disabled'}
                  className={classes.icons}
                />
              }
            >
              Photos
            </Button>
            <Button
              className={clsx(classes.sidebarButton, {
                [classes.activeTabStyle]: currentActiveTab === 'documents',
              })}
              onClick={() => setCurrentActiveTab('documents')}
              startIcon={
                <InsertDriveFileOutlinedIcon
                  color={currentActiveTab === 'documents' ? 'primary' : 'disabled'}
                  className={classes.icons}
                />
              }
            >
              Documents
            </Button>
            <Button
              className={clsx(classes.sidebarButton, {
                [classes.activeTabStyle]: currentActiveTab === 'notes',
              })}
              onClick={() => setCurrentActiveTab('notes')}
              startIcon={
                <NoteOutlinedIcon
                  color={currentActiveTab === 'notes' ? 'primary' : 'disabled'}
                  className={classes.icons}
                />
              }
            >
              Notes
            </Button>
            <Button
              className={clsx(classes.sidebarButton, {
                [classes.activeTabStyle]: currentActiveTab === 'inspiration',
              })}
              onClick={() => setCurrentActiveTab('inspiration')}
              startIcon={
                <EmojiObjectsOutlinedIcon
                  color={currentActiveTab === 'inspiration' ? 'primary' : 'disabled'}
                  className={classes.icons}
                />
              }
            >
              Inspiration
            </Button> */}
      </Box>
      <Box>
        <Button
          className={classes.returnButton}
          onClick={() => history.push('/')}
          startIcon={
            <Logout
              sx={{
                color: theme.palette.secondary.likes,
                fontSize: '35px !important',
                webkitTransform: 'scaleX(-1)',
                transform: 'scaleX(-1)',
                marginRight: '10px',
              }}
            />
          }
        >
          Mes séjours
        </Button>
      </Box>
    </Paper>
  ) : (
    <>
      <Paper variant="outlined" square className={classes.xsNav}>
        <Tabs
          centered
          variant="fullWidth"
          value={0}
          TabIndicatorProps={{ sx: { display: 'none' } }}
        >
          <Tab
            icon={
              <Logout
                sx={{
                  color: theme.palette.secondary.likes,
                  fontSize: '35px',
                  webkitTransform: 'scaleX(-1)',
                  transform: 'scaleX(-1)',
                }}
              />
            }
            onClick={() => history.push('/')}
            // value="myTrips"
            sx={{ padding: '0', minWidth: '20vw !important' }}
          />
          {/* <Tab
            icon={
              <Person
                sx={{
                  color: openModal === 'editEditors' && theme.palette.primary.main,
                  fontSize: '35px',
                }}
              />
            }
            onClick={() => setOpenModal('editEditors')}
            value="editEditors"
            sx={{ marginRight: '8vw', padding: '0', minWidth: '20vw !important' }}
          /> */}
          <Tab
            icon={
              <Badge
                color="secondary"
                badgeContent={
                  assistantMessages?.length > 0 &&
                  assistantMessages?.filter(message => {
                    const hasUserSeen = message.notifications?.filter(notification => {
                      if (notification.userId === user.id && !notification.hasSeen) {
                        return true
                      }
                      return false
                    })
                    if (hasUserSeen?.length > 0) {
                      return true
                    }
                    return false
                  }).length
                }
                invisible={assistantMessages?.length < 1}
              >
                <Explore
                  sx={{
                    fontSize: '35px',
                    color: isChatOpen === 'AIChat' && theme.palette.primary.main,
                  }}
                />
              </Badge>
            }
            onClick={() => {
              setIsChatOpen('AIChat')
              updateHasSeen('Assistant')
            }}
            // value="AIChatWindow"
            sx={{ padding: '0', minWidth: '20vw !important', marginRight: '8vw' }}
          />

          <Box sx={{ maxHeight: '80px', height: '80px', paddingBottom: '5px' }}>
            <FabDial actions={addActions} tripId={tripId} />
          </Box>

          {/* <Tab
          icon={<img src={currentActiveTab === 'photos' ? photoGreen : photo} alt="" />}
          label={
            <Box
              component="span"
              className={clsx(classes.spanNav, {
                [classes.activeMobileTabStyle]: currentActiveTab === 'photos',
              })}
            >
              Photo
            </Box>
          }
          onClick={() => setCurrentActiveTab('photos')}
          value="photos"
        /> */}
          <Tab
            icon={
              <Badge
                color="secondary"
                badgeContent={
                  messages?.length > 0 &&
                  messages?.filter(message => {
                    const hasUserSeen = message.notifications?.filter(notification => {
                      if (notification.userId === user.id && !notification.hasSeen) {
                        return true
                      }
                      return false
                    })
                    if (hasUserSeen?.length > 0) {
                      return true
                    }
                    return false
                  }).length
                }
                invisible={messages?.length < 1}
              >
                <Forum
                  sx={{
                    color: isChatOpen === 'userChat' && theme.palette.primary.main,
                    fontSize: '35px',
                  }}
                />
              </Badge>
            }
            onClick={() => {
              setIsChatOpen('userChat')
              updateHasSeen('messages')
            }}
            // value="userChat"
            sx={{ padding: '0', minWidth: '20vw !important', marginLeft: '8vw' }}
          />
          <Tab
            onClick={() => {
              setRefreshNotif(true)
              handleOpen()
              setNotificationsToNewStateOnTrip(user, tripId, 2)
            }}
            icon={
              // <Notifications
              //   sx={{
              //     color: openModal === 'editEditors' && theme.palette.primary.main,
              //     fontSize: '35px',
              //   }}
              // />
              <MobileNotificationArea
                currentNotifications={currentNotifications}
                tripId={tripId}
                setRefreshNotif={setRefreshNotif}
              />
            }
            // value="myNotifications"
            sx={{ padding: '0', minWidth: '20vw !important' }}
          />
        </Tabs>
      </Paper>
      <Dialog
        fullScreen
        open={isMobilePlusOpen}
        onClose={() => setIsMobilePlusOpen(false)}
        TransitionComponent={Transition}
      >
        <MobilePlus tripData={tripData} tripId={tripId} setIsOpen={setIsMobilePlusOpen} />
      </Dialog>
    </>
  )
}

export default TripPageNav

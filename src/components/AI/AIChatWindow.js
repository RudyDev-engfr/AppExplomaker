import React, { useContext, useEffect, useRef, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import {
  Box,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { differenceInMinutes } from 'date-fns'
import { EmojiEmotionsOutlined, Send } from '@mui/icons-material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { makeStyles, useTheme } from '@mui/styles'
import { useHistory, useParams } from 'react-router-dom'

import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { geocodeByAddress, geocodeByPlaceId } from 'react-google-places-autocomplete'

import { FirebaseContext } from '../../contexts/firebase'
import { SessionContext } from '../../contexts/session'
import CustomAvatar from '../atoms/CustomAvatar'

import { rCTFF } from '../../helper/functions'
import { TripContext } from '../../contexts/trip'
import { PlanningContext } from '../../contexts/planning'

const useStyles = makeStyles(theme => ({
  basePaper: {
    width: '500px',
    borderLeft: 'unset',
    maxHeight: 'calc(100vh - 1px)',
    boxShadow: '-5px 0px 15px -3px rgba(0,0,0,0.1)',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      height: '100vh',
      zIndex: '10001',
    },
  },
  chatsPaper: {
    backgroundColor: '#f7f7f7',
    minHeight: 'calc(100vh - 77px)',
    maxHeight: 'calc(100vh - 77px)',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr minmax(45px, auto)',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      minHeight: 'calc(100vh - 60px)',
      maxHeight: 'calc(100vh - 60px)',
      borderRadius: 'unset',
    },
  },
  inputChat: {
    backgroundColor: '#fff',
    borderRadius: '0',
    borderLeft: '1px solid white',
  },
  messagePaper: {
    borderRadius: '0',
    padding: '15px 0',
    borderBottom: '1px solid lightgrey',
    maxWidth: '100%',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  dateMessage: {
    fontSize: '12px',
    marginBottom: '5px',
    paddingLeft: '66px',
  },
  contentTypo: {
    '& place': {
      fontWeight: 700,
    },
  },
  form: {
    height: '0',
  },
}))
const AIChatWindow = ({ isChatOpen, setIsChatOpen, chats, tripId }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useContext(SessionContext)
  const { firestore, timestampRef } = useContext(FirebaseContext)
  const { hasClicked, currentTravelers } = useContext(TripContext)

  const dummy = useRef()
  const [messageToSend, setMessageToSend] = useState('')

  const chatNames = []
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.entries(chats)) {
    chatNames.push(key[0])
  }
  const [openChat, setOpenChat] = useState(chatNames[0])
  const [isMounted, setIsMounted] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [currentMessages, setCurrentMessages] = useState([])

  const addEmoji = e => {
    const emoji = e.native
    setMessageToSend(prev => prev + emoji)
  }

  const messagesRef = firestore.collection('trips').doc(tripId).collection('Assistant')
  const query = messagesRef.orderBy('createdAt', 'desc').limit(25)
  const [messages] = useCollectionData(query, { idField: 'messageId' })

  const handleSubmit = async event => {
    event.preventDefault()
    const { id } = user
    await messagesRef.add({
      text: messageToSend,
      createdAt: new timestampRef.fromDate(new Date()),
      userId: id,
      notifications: currentTravelers
        .filter(traveler => traveler.id !== id)
        .map(traveler => ({ userId: traveler.id, hasSeen: false })),
    })

    setMessageToSend('')
    dummy.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (messages) {
      const tempMessages = [...messages]
      messages.forEach(({ createdAt, userId }, index) => {
        if (index > 0) {
          if (
            userId === messages[index - 1]?.userId &&
            messages[index - 1].createdAt &&
            differenceInMinutes(rCTFF(createdAt), rCTFF(messages[index - 1].createdAt)) < 5
          ) {
            tempMessages[index].groupDate = true
          }
        }
      })
      setCurrentMessages(tempMessages)
    }
  }, [messages])

  useEffect(() => {
    if (!isMounted && messages?.length > 0 && dummy?.current?.scrollIntoView) {
      setTimeout(() => {
        dummy.current.scrollIntoView({ behavior: 'smooth' })
        setIsMounted(true)
      }, 500)
    }
  }, [dummy, messages])

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={isChatOpen === 'AIChat'}
      PaperProps={{ className: classes.basePaper }}
      disableScrollLock={false}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          display="flex"
          flexDirection={matchesXs ? 'row' : 'column'}
          alignItems="center"
          width="100%"
          sx={{ maxHeight: '140px' }}
        >
          {!matchesXs && (
            <Box
              sx={{
                height: '65px',
                width: '100%',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '30px',
                paddingTop: '10px',
                color: theme.palette.secondary.contrastText,
                borderBottom: '1px solid white',
              }}
            >
              <Typography variant="h4" sx={{ fontSize: '25px' }}>
                L&apos;Assistant
              </Typography>
            </Box>
          )}
          {matchesXs && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                height: '50px',
                paddingTop: '15px',
                borderBottom: '2px solid #F7F7F7',
                width: '100%',
              }}
            >
              <Box
                display="flex"
                flexDirection={matchesXs ? 'row' : 'column'}
                alignItems="center"
                width="100%"
              >
                <Typography variant="h4" sx={{ fontSize: '25px !important', paddingLeft: '50px' }}>
                  L&apos;Assistant
                </Typography>
                <Box position="absolute" left="20px">
                  <IconButton
                    aria-label="back"
                    edge="start"
                    onClick={() => {
                      setIsChatOpen(false)
                    }}
                  >
                    <ArrowBackIosIcon sx={{ transform: 'translate(5px ,-5px)' }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}

          {/* <Box display="flex">
            {chatNames.map((chatName, index) => (
              <IconButton
                key={uuidv4()}
                onClick={() => setOpenChat(chatName)}
                className={clsx(classes.chatIcon, {
                  [classes.firstIcon]: index === 0,
                  [classes.activeChat]: openChat === chatName,
                })}
                size="large"
              >
                index === 0 ? (
                <img
                  style={
                    openChat === chatName
                      ? {
                          filter:
                            'invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%)',
                        }
                      : {}
                  }
                  src={logo}
                  alt=""
                />
              ) : (
                <PersonRounded />
              ) 
                <PersonRounded />
              </IconButton>
            ))}
          </Box> */}
        </Box>
        <Paper elevation={0} className={classes.chatsPaper}>
          <ChatBox
            data={chats[openChat]}
            messages={messages}
            dummy={dummy}
            currentMessages={currentMessages}
            setCurrentMessages={setCurrentMessages}
          />
          <form onSubmit={event => handleSubmit(event)} className={classes.form}>
            <Box
              sx={{
                [theme.breakpoints.down('sm')]: { position: 'fixed', bottom: '0', width: '100%' },
              }}
            >
              <FormControl fullWidth>
                {showEmojiPicker && <Picker onEmojiSelect={addEmoji} />}
                <TextField
                  fullWidth
                  InputProps={{
                    className: classes.inputChat,
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <EmojiEmotionsOutlined />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          type="submit"
                          disabled={
                            !messageToSend ||
                            currentMessages[currentMessages.length - 1]?.userId === user.id ||
                            currentMessages[currentMessages.length - 1]?.questionType === 'temp'
                          }
                          color="primary"
                        >
                          <Send />
                        </IconButton>
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                    multiline: true,
                    onKeyDown: event => {
                      if (event.key === 'Enter') {
                        if (event.metaKey || event.ctrlKey || event.shiftKey) {
                          // Allow the new line to be added by not preventing the default behavior
                        } else {
                          // event.preventDefault()
                          handleSubmit(event)
                        }
                      }
                    },
                  }}
                  disabled={
                    currentMessages[currentMessages.length - 1]?.userId === user.id ||
                    currentMessages[currentMessages.length - 1]?.questionType === 'temp' ||
                    hasClicked
                  }
                  value={messageToSend}
                  onChange={e => setMessageToSend(e.target.value)}
                  maxRows={15}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderLeft: 'none',
                      borderRight: 'none',
                      borderBottom: 'none',
                    },
                  }}
                />
              </FormControl>
            </Box>
          </form>
        </Paper>
      </Box>
    </Drawer>
  )
}

const ChatBox = ({ messages, dummy, currentMessages, setCurrentMessages }) => (
  <Box maxHeight="100%" minHeight="100%" overflow="auto">
    {currentMessages.map(message => (
      <ChatMessage key={message.messageId} {...message} />
    ))}
    <span ref={dummy} />
  </Box>
)

const ChatMessage = ({
  createdAt,
  userId,
  text = '',
  groupDate,
  questionType,
  eventDescription,
  messageId,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const { tripId } = useParams()
  const { user } = useContext(SessionContext)
  const { firestore } = useContext(FirebaseContext)
  const history = useHistory()
  const {
    setIsAssistantGuided,
    setCurrentView,
    setEventType,
    setEditMode,
    currentLocation,
    setCurrentLocation,
  } = useContext(TripContext)

  useEffect(() => {
    console.log('---- current ----', currentLocation)
  }, [currentLocation])

  useEffect(() => {
    if (text) {
      const placeArray = document.getElementsByTagName('place')
      const tempPlaceArray = Array.from(placeArray)
      let tempLocation
      if (Array.isArray(tempPlaceArray) && tempPlaceArray.length > 0) {
        tempPlaceArray?.forEach(singlePlace => {
          // eslint-disable-next-line no-param-reassign
          singlePlace.onclick = function placeClick() {
            const tempPlaceId = singlePlace.getAttribute('place_id')
            const testGeocode = geocodeByPlaceId(tempPlaceId).then(results =>
              console.log('placeidresults', results)
            )
            history.push(`/tripPage/${tripId}/planning`)
            tempLocation = geocodeByPlaceId(tempPlaceId).then(results =>
              setCurrentLocation(results)
            )
            setIsAssistantGuided(true)
            setEventType(singlePlace.getAttribute('tag_type'))
            setCurrentView('creator')
            setEditMode(false)
          }
        })
      }
    }
  }, [])

  return (
    <>
      <Grid container alignItems="flex-end">
        <Grid item xs={12}>
          <Box position="relative">
            <Paper
              className={classes.messagePaper}
              sx={{
                backgroundColor:
                  userId !== 'VK0TN3JqdNSiAU039WNoilgeREq2'
                    ? theme.palette.secondary.contrastText
                    : theme.palette.primary.main,
                color:
                  userId !== 'VK0TN3JqdNSiAU039WNoilgeREq2'
                    ? theme.palette.grey['33']
                    : theme.palette.secondary.contrastText,
              }}
            >
              {createdAt && !groupDate && questionType !== 'temp' && (
                <Typography
                  className={classes.dateMessage}
                  sx={{
                    color:
                      userId !== 'VK0TN3JqdNSiAU039WNoilgeREq2'
                        ? theme.palette.grey['33']
                        : theme.palette.secondary.contrastText,
                  }}
                >
                  {rCTFF(createdAt, 'dd/MM HH:mm')}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gridGap: '20px' }}>
                {createdAt && !groupDate && (
                  <Box ml={1.5}>
                    <CustomAvatar peopleIds={[userId]} width={30} height={30} />
                  </Box>
                )}
                <Typography
                  variant="body2"
                  sx={{
                    wordWrap: 'break-word',
                    textOverflow: 'clip',
                    maxWidth: 'calc(100% - 60px)',
                    whiteSpace: 'pre-line',
                  }}
                  className={classes.contentTypo}
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default AIChatWindow

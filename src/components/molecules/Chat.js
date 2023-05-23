import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Box,
  Drawer,
  FormControl,
  IconButton,
  Paper,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
} from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import makeStyles from '@mui/styles/makeStyles'
import { EmojiEmotionsOutlined, Send } from '@mui/icons-material'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { differenceInMinutes } from 'date-fns'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { SessionContext } from '../../contexts/session'
import { FirebaseContext } from '../../contexts/firebase'
import CustomAvatar from '../atoms/CustomAvatar'
import { rCTFF } from '../../helper/functions'

const useStyles = makeStyles(theme => ({
  basePaper: {
    width: '500px',
    borderLeft: 'unset',
    maxHeight: '100vh',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      height: '100vh',
      zIndex: '10001',
    },
  },
  chatsPaper: {
    borderRadius: '18px',
    margin: '24px 8px 0',
    backgroundColor: '#f7f7f7',
    minHeight: 'calc(100vh - 170px)',
    maxHeight: 'calc(100vh - 170px)',
    width: 'calc(500px - 36px)',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'minmax(94px, auto) 1fr minmax(45px, auto)',
    [theme.breakpoints.down('sm')]: {
      margin: '24px 0 0 0',
      width: '100%',
      minHeight: 'calc(100vh - 48px - 32px - 24px)',
      maxHeight: 'calc(100vh - 48px - 32px - 24px)',
      borderRadius: 'unset',
    },
  },
  chatHeader: {
    backgroundColor: 'white',
    border: '1px solid #F7F7F7',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      borderRadius: 'unset',
      flexDirection: 'row',
      border: 'unset',
    },
  },
  // chatIcon: {
  //   width: '50px',
  //   transition: 'all 0.2s',
  //   backgroundColor: '#f7f7f7',
  //   color: '#bdbdbd',
  //   '&:hover': {
  //     background: '#009d8c',
  //     color: '#fff',
  //   },
  //   '& img': {
  //     maxWidth: '80%',
  //     filter:
  //       'invert(47%) sepia(60%) saturate(1204%) hue-rotate(137deg) brightness(82%) contrast(102%)',
  //   },
  //   '&:hover img': {
  //     filter:
  //       'invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%)',
  //   },
  // },
  // activeChat: { backgroundColor: '#009d8c', color: 'white' },
  // firstIcon: { marginRight: '.75rem' },
  messagePaper: {
    borderRadius: '10px',
    wordWrap: 'break-word',
    margin: theme.spacing(1),
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  },
  inputChat: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '.5rem 1rem',
    margin: '0 .5rem',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  messageTypo: {
    wordWrap: 'break-word',
    textOverflow: 'clip',
    whiteSpace: 'pre-line',
  },
}))

const Chat = ({ isChatOpen, setIsChatOpen, chats, tripId }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useContext(SessionContext)
  const { firestore, timestampRef } = useContext(FirebaseContext)

  const dummy = useRef()
  const [messageToSend, setMessageToSend] = useState('')

  const chatNames = []
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.entries(chats)) {
    chatNames.push(key[0])
  }
  const [openChat, setOpenChat] = useState(chatNames[0])
  const [isMounted, setIsMounted] = useState(false)

  const messagesRef = firestore.collection('trips').doc(tripId).collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)
  const [messages] = useCollectionData(query, { idField: 'messageId' })
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const addEmoji = e => {
    const emoji = e.native
    setMessageToSend(prev => prev + emoji)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const { id } = user
    await messagesRef.add({
      text: messageToSend,
      createdAt: new timestampRef.fromDate(new Date()),
      userId: id,
    })

    setMessageToSend('')
    dummy.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
      open={isChatOpen === 'userChat'}
      PaperProps={{ className: classes.basePaper }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          display="flex"
          flexDirection={matchesXs ? 'row' : 'column'}
          alignItems="center"
          width="100%"
          justifyContent={matchesXs ? 'space-evenly' : 'normal'}
          sx={{ maxHeight: '140px' }}
        >
          {!matchesXs && (
            <Box
              sx={{
                height: '64px',
                width: '100%',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '30px',
                paddingTop: '10px',
                color: theme.palette.secondary.contrastText,
              }}
            >
              <Typography variant="h4" sx={{ fontSize: '28px' }}>
                Discussion
              </Typography>
            </Box>
          )}
          {matchesXs && (
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
          <Paper className={classes.chatHeader}>
            <Box>
              <Typography>{}</Typography>
              <Typography variant="subtitle1" color="primary">
                {chats[openChat].description}
              </Typography>
            </Box>
            <CustomAvatar peopleIds={chats[openChat].participants} />
          </Paper>
          <ChatBox data={chats[openChat]} messages={messages} dummy={dummy} />
          <form onSubmit={event => handleSubmit(event)}>
            <Box
              mx={1}
              sx={{
                [theme.breakpoints.down('sm')]: { position: 'fixed', bottom: '0', width: '90%' },
              }}
            >
              <FormControl fullWidth>
                {showEmojiPicker && <Picker onEmojiSelect={addEmoji} />}
                <TextField
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
                          disabled={!messageToSend}
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
                  value={messageToSend}
                  onChange={e => setMessageToSend(e.target.value)}
                  maxRows={15}
                />
              </FormControl>
            </Box>
          </form>
        </Paper>
      </Box>
    </Drawer>
  )
}

const ChatBox = ({ messages, dummy }) => {
  const [currentMessages, setCurrentMessages] = useState([])

  useEffect(() => {
    if (messages) {
      const tempMessages = [...messages]
      messages.forEach(({ createdAt, userId }, index) => {
        if (index > 0) {
          if (
            userId === messages[index - 1].userId &&
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

  return (
    <Box maxHeight="100%" minHeight="100%" overflow="auto">
      {currentMessages.map(message => (
        <ChatMessage key={message.messageId} {...message} />
      ))}
      <span ref={dummy} />
    </Box>
  )
}

const ChatMessage = ({ createdAt, userId, text = '', groupDate }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { user } = useContext(SessionContext)

  if (userId === user.id) {
    return (
      <>
        {createdAt && !groupDate && (
          <Typography
            align="center"
            sx={{ fontSize: '12px', color: theme.palette.grey.bd, mt: 1.5 }}
          >
            {rCTFF(createdAt, 'dd/MM HH:mm')}
          </Typography>
        )}
        <Grid container alignItems="flex-end">
          <Grid item xs={2} />
          <Grid item xs={9}>
            <Box mx={1} position="relative" left="20px">
              <Paper
                className={classes.messagePaper}
                sx={{
                  backgroundColor: '#006A75',
                }}
              >
                <Typography variant="body2" className={classes.messageTypo} sx={{ color: 'white' }}>
                  {text}
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </>
    )
  }
  return (
    <>
      {createdAt && !groupDate && (
        <Typography align="center" sx={{ fontSize: '12px', color: theme.palette.grey.bd, mt: 1.5 }}>
          {rCTFF(createdAt, 'dd/MM HH:mm')}
        </Typography>
      )}
      <Grid container alignItems="flex-end">
        <Grid item xs={2}>
          {createdAt && !groupDate && (
            <Box mb={1} ml={1.5}>
              <CustomAvatar peopleIds={[userId]} />
            </Box>
          )}
        </Grid>
        <Grid item xs={9}>
          <Box ml={1}>
            <Paper className={classes.messagePaper}>
              <Typography variant="body2">{text}</Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Chat

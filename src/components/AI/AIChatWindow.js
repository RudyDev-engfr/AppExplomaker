import React, { useContext, useEffect, useRef, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import {
  Box,
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

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { FirebaseContext } from '../../contexts/firebase'
import { SessionContext } from '../../contexts/session'
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
    gridTemplateRows: '1fr minmax(45px, auto)',
    [theme.breakpoints.down('sm')]: {
      margin: '24px 0 0 0',
      width: '100%',
      minHeight: 'calc(100vh - 48px - 32px - 24px)',
      maxHeight: 'calc(100vh - 48px - 32px - 24px)',
      borderRadius: 'unset',
    },
  },
  inputChat: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '.5rem 1rem',
    margin: '0 .5rem',
  },
  messagePaper: {
    borderRadius: '0',
    padding: '8px 16px',
    borderBottom: '1px solid lightgrey',
    maxWidth: '100%',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  dateMessage: {
    fontSize: '12px',
    color: theme.palette.grey['82'],
    marginBottom: '5px',
  },
}))
const AIChatWindow = ({ isChatOpen, setIsChatOpen, chats, tripId }) => {
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const addEmoji = e => {
    const emoji = e.native
    setMessageToSend(prev => prev + emoji)
  }

  const messagesRef = firestore.collection('trips').doc(tripId).collection('AIChat')
  const query = messagesRef.orderBy('createdAt').limit(25)
  const [messages] = useCollectionData(query, { idField: 'messageId' })

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

  useEffect(() => {
    console.log(messageToSend)
  }, [messageToSend])

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={isChatOpen === 'AIChat'}
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
                justifyContent: 'center',
                paddingRight: '180px',
                color: theme.palette.secondary.contrastText,
              }}
            >
              <Typography variant="h4">L&apos;Assistant</Typography>
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
        <Grid container alignItems="flex-end">
          <Grid item xs={12}>
            <Box position="relative">
              <Paper
                className={classes.messagePaper}
                sx={{
                  backgroundColor: theme.palette.secondary.contrastText,
                }}
              >
                {createdAt && !groupDate && (
                  <Typography className={classes.dateMessage}>
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
                      maxWidth: 'calc(100% - 80px)',
                    }}
                  >
                    {text}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </>
    )
  }
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          {createdAt && !groupDate && (
            <Box mb={1} ml={1.5}>
              <CustomAvatar peopleIds={[userId]} />
            </Box>
          )}
          <Box sx={{ marginLeft: '8px' }}>
            <Paper className={classes.messagePaper}>
              {createdAt && !groupDate && (
                <Typography className={classes.dateMessage}>
                  {rCTFF(createdAt, 'dd/MM HH:mm')}
                </Typography>
              )}
              <Typography variant="body2" sx={{ wordWrap: 'break-all' }}>
                {text}
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default AIChatWindow

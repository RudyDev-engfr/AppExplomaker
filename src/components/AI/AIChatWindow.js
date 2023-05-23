import React, { useContext, useEffect, useRef, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import {
  Box,
  Drawer,
  FormControl,
  IconButton,
  Input,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { Send } from '@mui/icons-material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { makeStyles, useTheme } from '@mui/styles'

import { FirebaseContext } from '../../contexts/firebase'
import { SessionContext } from '../../contexts/session'
import CustomAvatar from '../atoms/CustomAvatar'
import { ChatBox } from '../molecules/Chat'

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
  inputChat: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '.5rem 1rem',
    margin: '0 .5rem',
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

  const messagesRef = firestore.collection('trips').doc(tripId).collection('messages')
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
                <Input
                  inputProps={{ className: classes.inputChat }}
                  value={messageToSend}
                  onChange={e => setMessageToSend(e.target.value)}
                  // startAdornment={
                  //   <IconButton size="small" color="primary" variant="outlined" disabled>
                  //     <Add />
                  //   </IconButton>
                  // }
                  endAdornment={
                    <IconButton
                      size="small"
                      type="submit"
                      disabled={!messageToSend}
                      color="primary"
                    >
                      <Send />
                    </IconButton>
                  }
                  disableUnderline
                  multiline
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
export default AIChatWindow

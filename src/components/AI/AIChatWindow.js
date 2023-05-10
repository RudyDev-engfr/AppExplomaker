import React, { useContext } from 'react'
import { Box, Drawer, makeStyles, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/styles'

import { FirebaseContext } from '../../contexts/firebase'
import { SessionContext } from '../../contexts/session'

const useStyles = makeStyles(theme => ({
  basePaper: {
    width: '500px',
    borderLeft: 'unset',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      height: '100vh',
      zIndex: '10001',
    },
  },
}))
const AIChatWindow = ({ isChatOpen, setIsChatOpen, chats, tripId }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useContext(SessionContext)
  const { firestore, timestampRef } = useContext(FirebaseContext)

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={isChatOpen}
      PaperProps={{ className: classes.basePaper }}
    >
      <Box />
    </Drawer>
  )
}
export default AIChatWindow

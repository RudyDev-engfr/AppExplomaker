import React, { useContext } from 'react'
import { AppBar, Badge, Box, Drawer, IconButton, Toolbar, useMediaQuery } from '@mui/material'
import { ForumOutlined, Notifications, SmartToy } from '@mui/icons-material'
import { makeStyles, useTheme } from '@mui/styles'

import { SessionContext } from '../../contexts/session'
import { TripContext } from '../../contexts/trip'

const useStyles = makeStyles(theme => ({
  AppBarRoot: {
    zIndex: 100000,
    top: '0',
    right: '0',
    width: '180px',
  },
}))

const SocialNavbar = () => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { isChatOpen, setIsChatOpen } = useContext(TripContext)
  const { user } = useContext(SessionContext)

  return (
    <AppBar position="fixed" classes={{ root: classes.AppBarRoot }}>
      <Toolbar>
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
              <SmartToy />
            </Badge>
          </IconButton>
          <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
            <Badge badgeContent={17} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton onClick={() => setIsChatOpen(!isChatOpen)} color="inherit">
            <ForumOutlined />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
export default SocialNavbar

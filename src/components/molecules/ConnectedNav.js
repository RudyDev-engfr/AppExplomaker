import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Link, useMediaQuery } from '@mui/material'
import ButtonBase from '@mui/material/ButtonBase'
import { makeStyles } from '@mui/styles'
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined'
import ContactSupportOutlined from '@mui/icons-material/ContactSupportOutlined'
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined'
import TravelExplore from '@mui/icons-material/TravelExplore'
import LogoutOutlined from '@mui/icons-material/LogoutOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import clsx from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { FirebaseContext } from '../../contexts/firebase'
import { SessionContext } from '../../contexts/session'

import home from '../../images/icons/accueil.svg'
import logoFull from '../../images/icons/logoFull.svg'
import logoGrey from '../../images/icons/logoGrey.svg'
import inspi from '../../images/icons/inspiLine.svg'
import searchIcon from '../../images/icons/search.svg'
import profil from '../../images/icons/profil.svg'
import favorite from '../../images/icons/favorite.svg'
import { buildNotifications } from '../../helper/functions'

import NotificationArea from './NotificationArea'
import MobileNotificationArea from './MobileNotificationArea'

const useStyles = makeStyles(theme => ({
  header: {
    backgroundColor: '#fff',
    padding: '20px 0',
    transition: '0.3s all linear',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '1000',
    boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04), 0px 2px 8px rgba(0, 0, 0, 0.03)',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInnerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  autocontainerNav: {
    maxWidth: '1140px',
    padding: '0px 15px',
    margin: '0 auto',
  },
  navLink: {
    position: 'relative',
    fontSize: '14px',
    letterSpacing: '0.03em',
    color: theme.palette.grey['33'],
    transition: '0.2s linear',
    marginRight: '35px',
    textDecoration: 'none',
    textTransform: 'none',
    '&::before': {
      transition: '0.3s linear',
      top: '110%',
      left: '0',
      borderRadius: '20px',
      height: '2px',
      width: '0',
      position: 'absolute',
      content: '""',
      background: '#006a75',
    },
    '&:hover': {
      color: '#006a75',
      backgroundColor: 'unset !important',
    },
    '&:hover::before': {
      width: '100%',
    },
  },
  profilBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 20px 5px 10px',
    borderRadius: '50px',
    zIndex: '1',
    position: 'relative',
    textTransform: 'unset',
    height: '40px',
    border: '1px solid #E0E0E0',
  },
  greyBgc: {
    backgroundColor: theme.palette.grey.f7,
  },
  // mobile Part
  xsNav: {
    backgroundColor: 'white',
    position: 'fixed',
    bottom: '0',
    width: '100%',
    height: '90px',
    padding: theme.spacing(1.5),
    zIndex: '100',
  },
  icons: {
    color: theme.palette.grey['33'],
    fontSize: '9px',
    fontWeight: '800',
  },
  tabs: {
    '& button': { textTransform: 'none' },
  },
  tabsMobileImg: {
    width: '33px',
  },
  logoFull: {
    width: '180px',
  },
  menuItemStyle: {
    width: '24px',
    height: '24px',
  },
  img: {
    width: '33px',
    height: '33px',
  },
  muiLink: {
    color: theme.palette.grey['33'],
  },
}))

const ConnectedNav = () => {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { auth, database } = useContext(FirebaseContext)
  const { user, currentUserNotifications } = useContext(SessionContext)
  // eslint-disable-next-line no-unused-vars
  const [currentNotifications, setCurrentNotifications] = useState([])

  const [anchorEl, setAnchorEl] = useState(null)
  const [refreshNotif, setRefreshNotif] = useState(false)
  const [currentMobileNavTab, setCurrentMobileNavTab] = useState(3)
  const [isChatOpen, setIsChatOpen] = useState('')

  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const logoutHandler = () => {
    auth.signOut().then(() => {
      database.ref(`/status/${user.id}`).set('offline')
      localStorage.removeItem('newTrip')
    })
  }

  const handleChange = (event, newValue) => {
    setCurrentMobileNavTab(newValue)
  }

  const handleNotifications = () => {
    buildNotifications(user).then(notifications => setCurrentNotifications(notifications))
  }

  useEffect(() => {
    if (user && refreshNotif) {
      const tempNotif = handleNotifications(user)
      setCurrentNotifications(tempNotif)
      setRefreshNotif(false)
    }
  }, [user, refreshNotif])

  useEffect(() => {
    const { pathname } = location
    if (pathname === '/') {
      setCurrentMobileNavTab('home')
    }
    switch (pathname) {
      case '/':
        setCurrentMobileNavTab(3)
        break
      case '/profile':
      case '/account':
      case '/settings':
      case '/help':
        setCurrentMobileNavTab(4)
        break
      default:
        setCurrentMobileNavTab(3)
    }
  }, [location])

  return matchesXs ? (
    <Paper variant="outlined" square className={classes.xsNav}>
      <Tabs centered className={classes.tabs} value={currentMobileNavTab} onChange={handleChange}>
        <Link passHref href="https://www.explomaker.fr" className={classes.muiLink}>
          <Tab
            icon={
              <img
                src={home}
                alt="home_logo"
                style={{
                  maxWidth: '100%',
                  height: '33px',
                }}
              />
            }
            label={
              <Box component="span" className={classes.icons}>
                Présentation
              </Box>
            }
            sx={{
              maxWidth: 'calc(20vw - 2px)',
              minWidth: '70px',
              color: theme.palette.grey.grey33,
            }}
            value={0}
            onClick={() => setCurrentMobileNavTab(0)}
          />
        </Link>
        <Link passHref href="https://www.explomaker.fr/inspiration" className={classes.muiLink}>
          <Tab
            icon={<img src={inspi} alt="Inspiration_logo" className={classes.img} />}
            label={
              <Box component="span" className={classes.icons}>
                Inspiration
              </Box>
            }
            sx={{
              maxWidth: 'calc(20vw - 2px)',
              minWidth: '70px',
              color: theme.palette.grey.grey33,
            }}
            value={1}
            onClick={() => setCurrentMobileNavTab(1)}
          />
        </Link>
        <Link
          passHref
          href="www.explomaker.fr/exploration"
          rel="nofollow"
          className={classes.muiLink}
        >
          <Tab
            icon={<TravelExplore sx={{ fontSize: '33px' }} />}
            label={
              <Box component="span" className={classes.icons}>
                Exploration
              </Box>
            }
            sx={{
              maxWidth: 'calc(20vw - 2px)',
              minWidth: '70px',
              color: theme.palette.grey.grey33,
            }}
            value={2}
            onClick={() => setCurrentMobileNavTab(2)}
          />
        </Link>
        <Link passHref href="/" className={classes.muiLink}>
          <Tab
            icon={
              <img
                src={logoGrey}
                alt="homePage_logo"
                style={{
                  maxWidth: '33px',
                  height: '33px',
                }}
              />
            }
            label={
              <Box component="span" className={classes.icons}>
                Séjours
              </Box>
            }
            sx={{
              maxWidth: 'calc(20vw - 2px)',
              minWidth: '70px',
              color: theme.palette.grey.grey33,
            }}
            value={3}
            onClick={() => setCurrentMobileNavTab(3)}
          />
        </Link>
        <Link passHref href="/profile" className={classes.muiLink}>
          <Tab
            icon={
              <img
                src={profil}
                alt="profile_logo"
                style={{
                  width: '33px',
                  maxWidth: '100%',
                  height: '33px',
                }}
              />
            }
            label={
              <Box component="span" className={classes.icons}>
                Profil
              </Box>
            }
            sx={{
              maxWidth: 'calc(20vw - 2px)',
              minWidth: '70px',
              color: theme.palette.grey.grey33,
            }}
            value={4}
            onClick={() => setCurrentMobileNavTab(4)}
          />
        </Link>
      </Tabs>
    </Paper>
  ) : (
    <Box className={clsx(classes.header)}>
      <Box className={classes.autocontainerNav}>
        <Box className={classes.headerInner}>
          <ButtonBase
            disableRipple
            disableTouchRipple
            onClick={() => {
              window.location.href = 'https://www.explomaker.fr'
            }}
          >
            <img src={logoFull} className={classes.logoFull} alt="" />
          </ButtonBase>
          <Box className={classes.headerInnerRight}>
            <Box>
              <Button
                disableRipple
                className={clsx(classes.navLink)}
                onClick={() => {
                  window.location.href = 'https://www.explomaker.fr'
                }}
              >
                Exploration
              </Button>
              <Button
                disableRipple
                className={clsx(classes.navLink)}
                onClick={() => {
                  window.location.href = 'https://www.explomaker.fr'
                }}
              >
                Inspiration
              </Button>
              <Button
                disableRipple
                className={clsx(classes.navLink)}
                onClick={() => {
                  window.location.href = 'https://www.explomaker.fr'
                }}
              >
                Séjours
              </Button>
            </Box>
            <Box position="relative" display="flex">
              <Badge badgeContent={0} color="secondary" overlap="circular">
                <Box sx={{ marginRight: '33px' }}>
                  <Button
                    className={clsx(classes.profilBtn, { [classes.greyBgc]: anchorEl })}
                    startIcon={<Avatar src={user.avatar} sx={{ width: 30, height: 30 }} />}
                    endIcon={<MenuIcon sx={{ color: theme.palette.grey['4f'] }} />}
                    id="connected-button"
                    aria-controls="connected-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  />
                  <Menu
                    id="connected-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    disableScrollLock
                    MenuListProps={{
                      'aria-labelledby': 'connected-button',
                    }}
                    anchorPosition={{ left: 100, top: 100 }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose()
                        window.location.href = 'https://www.explomaker.fr/exploration'
                      }}
                    >
                      <Box
                        component="span"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginRight="14px"
                      >
                        <img src={searchIcon} alt="" className={classes.menuItemStyle} />
                      </Box>
                      Recherche
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose()
                        window.location.href = 'https://www.explomaker.fr'
                      }}
                    >
                      <Box
                        component="span"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginRight="14px"
                      >
                        <img src={logoGrey} alt="" className={classes.menuItemStyle} />
                      </Box>
                      Présentation
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose()
                        window.location.href = 'https://explomaker.fr/favorites'
                      }}
                    >
                      <Box
                        component="span"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginRight="14px"
                      >
                        <FavoriteBorderOutlined
                          sx={{
                            color: theme.palette.grey['4f'],
                            opacity: '0.5',
                          }}
                        />
                      </Box>
                      Favoris
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose()
                        history.push('/profile')
                      }}
                    >
                      <Box
                        component="span"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginRight="14px"
                      >
                        <AccountCircleOutlined
                          sx={{
                            color: theme.palette.grey['4f'],
                            opacity: '0.5',
                          }}
                        />
                      </Box>
                      Profil
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose()
                        logoutHandler()
                      }}
                      sx={{ color: theme.palette.secondary.main }}
                    >
                      <Box
                        component="span"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginRight="14px"
                      >
                        <LogoutOutlined />
                      </Box>
                      Déconnexion
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        handleClose()
                        history.push('/help')
                      }}
                    >
                      <Box
                        component="span"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginRight="14px"
                      >
                        <ContactSupportOutlined
                          sx={{
                            color: theme.palette.grey['4f'],
                            opacity: '0.5',
                          }}
                        />
                      </Box>
                      Aide
                    </MenuItem>
                  </Menu>
                </Box>
              </Badge>
            </Box>
            {/* <Badge
              badgeContent={
                user?.notifications?.filter(
                  notification => !notification.tripId && notification.state === 1
                ).length
              }
              color="secondary"
            >
              <IconButton
                aria-label="more"
                id="notif-button"
                aria-controls={openNotif ? 'notif-menu' : undefined}
                aria-expanded={openNotif ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClickNotif}
                sx={{
                  backgroundColor:
                    user?.notifications?.filter(notification => notification.state === 1).length >
                      0 && theme.palette.primary.ultraLight,
                }}
              >
                <Notifications
                  sx={{
                    color:
                      user?.notifications?.filter(notification => notification.state === 1).length >
                        0 && theme.palette.primary.main,
                  }}
                />
              </IconButton>
            </Badge>
            <Menu
              anchorEl={anchorElNotif}
              id="notif-menu"
              open={openNotif}
              onClose={handleCloseNotif}
              onClick={handleCloseNotif}
              disableScrollLock
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Paper
                sx={{ width: '470px', height: '740px', maxHeight: '740px', overflowY: 'auto' }}
              >
                {currentNotifications?.map(notification => (
                  <Box
                    sx={{
                      width: '457px,',
                      height: '85px',
                      padding: '0 30px',
                      display: 'grid',
                      gridTemplate: '1fr / 110px 1fr',
                      alignItems: 'center',
                      marginBottom: '30px',
                      backgroundColor:
                        notification.state === 1 ? theme.palette.primary.ultraLight : 'white',
                    }}
                    key={notification.content}
                  >
                    <Avatar sx={{ width: 80, height: 80 }} />
                    <Box>
                      <Typography sx={{ fontSize: '13px' }}>{notification.content}</Typography>
                      <Typography sx={{ fontSize: '13px', color: theme.palette.primary.main }}>
                        {notification.timer}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </Menu> */}
            {!matchesXs ? (
              <NotificationArea
                currentNotifications={currentUserNotifications}
                setRefreshNotif={setRefreshNotif}
                isMyTrips
                setIsChatOpen={setIsChatOpen}
                isChatOpen={isChatOpen}
              />
            ) : (
              <MobileNotificationArea
                currentNotifications={currentUserNotifications}
                setRefreshNotif={setRefreshNotif}
                isMyTrips
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
export default ConnectedNav

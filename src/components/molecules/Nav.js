import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Link } from '@mui/material'
import { TravelExplore } from '@mui/icons-material'

import { makeStyles, useTheme } from '@mui/styles'
import clsx from 'clsx'
import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { SessionContext } from '../../contexts/session'
import ConnectedNav from './ConnectedNav'
import AuthModals from './AuthModals'

import home from '../../images/icons/accueil.svg'
import logoGrey from '../../images/icons/logoGrey.svg'
import profil from '../../images/icons/profil.svg'
import inspi from '../../images/icons/inspiLine.svg'
import logoFull from '../../images/icons/logoFull.svg'

const useStyles = makeStyles(theme => ({
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
  colorPrimaryMain: {
    color: theme.palette.primary.main,
    '&::before': {
      transition: '0.3s linear',
      top: '110%',
      left: '0',
      borderRadius: '20px',
      height: '2px',
      width: '0',
      position: 'absolute',
      content: '""',
      background: theme.palette.primary.main,
    },
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'unset !important',
    },
    '&:hover::before': {
      width: '100%',
    },
  },
  createAccountBtn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
    padding: '13px 18px',
    transition: '.2s all',
    borderRadius: '40px',
    fontSize: '14px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    textTransform: 'none',
  },
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
  autocontainerNav: {
    maxWidth: '1140px',
    padding: '0px 15px',
    margin: '0 auto',
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
  xsNav: {
    backgroundColor: 'white',
    position: 'fixed',
    bottom: '0',
    width: '100vw',
    height: '90px',
    padding: '10px',
    zIndex: '100',
  },
  tabs: {
    '& button': { textTransform: 'none' },
  },
  icons: {
    color: theme.palette.grey['33'],
    opacity: '0.7',
    fontSize: '9px',
    fontWeight: '800',
  },
  logoFull: {
    width: '180px',
  },
  tabsMobileImg: {
    width: '33px',
    height: '33px',
  },
  img: {
    width: '33px',
    height: '33px',
  },
}))

const Nav = () => {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { user } = useContext(SessionContext)

  const [isLoginModalOpen, setIsLoginModalOpen] = useState('')
  const [currentActiveTab, setCurrentActiveTab] = useState('home')
  const [currentMobileNavTab, setCurrentMobileNavTab] = useState(3)

  return (
    <>
      {user.isLoggedIn ? (
        <ConnectedNav />
      ) : matchesXs ? (
        <Paper variant="outlined" square className={classes.xsNav}>
          <Tabs centered variant="fullWidth" className={classes.tabs} value={currentMobileNavTab}>
            <Tab
              icon={<img src={home} alt="" className={classes.tabsMobileImg} />}
              label={
                <Box component="span" className={classes.icons}>
                  Présentation
                </Box>
              }
              onClick={() => {
                setCurrentMobileNavTab('home')
                window.location.href = 'https://www.explomaker.fr'
              }}
              sx={{
                maxWidth: 'calc(20vw - 2px)',
                minWidth: '70px',
                color: theme.palette.grey.grey33,
              }}
              value={0}
            />
            <Tab
              icon={<img src={inspi} alt="Inspiration_logo" className={classes.img} />}
              label={
                <Box component="span" className={classes.icons}>
                  Inspi
                </Box>
              }
              sx={{
                maxWidth: 'calc(20vw - 2px)',
                minWidth: '70px',
                color: theme.palette.grey.grey33,
              }}
              value={1}
              onClick={() => {
                window.location.href = 'https://www.explomaker/inspiration'
              }}
            />
            <Tab
              icon={
                <TravelExplore
                  sx={{ fontSize: '33px', color: theme.palette.grey['33'], opacity: '0.7' }}
                />
              }
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
              onClick={() => {
                window.location.href = 'https://www.explomaker.fr/exploration'
              }}
            />
            <Tab
              icon={<img src={logoGrey} width="25" alt="" className={classes.tabsMobileImg} />}
              label={
                <Box component="span" className={classes.icons}>
                  Séjours
                </Box>
              }
              onClick={() => {
                history.push('/')
                setCurrentMobileNavTab(3)
              }}
              sx={{
                maxWidth: 'calc(20vw - 2px)',
                minWidth: '70px',
                color: theme.palette.grey.grey33,
              }}
              value={3}
            />
            <Tab
              icon={<img src={profil} width="25" alt="" className={classes.tabsMobileImg} />}
              label={
                <Box component="span" className={classes.icons}>
                  Connexion
                </Box>
              }
              onClick={() => {
                setIsLoginModalOpen('login')
                setCurrentMobileNavTab(4)
              }}
              sx={{
                maxWidth: 'calc(20vw - 2px)',
                minWidth: '70px',
                color: theme.palette.grey.grey33,
              }}
              value={4}
            />
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
                  window.location.href = 'https://explomaker.fr'
                }}
              >
                <img src={logoFull} className={classes.logoFull} alt="" />
              </ButtonBase>
              <Box className={classes.headerInnerRight}>
                {/* <Button
                  disableRipple
                  className={clsx(classes.navLink)}
                  onClick={() => {
                    window.location.href = 'https://explomaker.fr'
                  }}
                >
                  Présentation
                </Button> */}
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
                {/* <Button
                  disableRipple
                  className={clsx(classes.navLink, classes.colorPrimaryMain)}
                  onClick={() => setIsLoginModalOpen('login')}
                >
                  Connexion
                </Button> */}
                <Button
                  disableElevation
                  className={classes.createAccountBtn}
                  onClick={() => setIsLoginModalOpen('login')}
                >
                  Connexion
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      <AuthModals
        modalState={isLoginModalOpen}
        modalStateSetter={setIsLoginModalOpen}
        setCurrentActiveTab={setCurrentActiveTab}
      />
    </>
  )
}

export default Nav

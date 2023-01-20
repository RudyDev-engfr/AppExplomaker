import { Box, Button, ButtonBase, Paper, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import { useState, React, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { SessionContext } from '../../contexts/session'
import ConnectedNav from './ConnectedNav'
import AuthModals from './AuthModals'

import home from '../../images/icons/accueil.svg'
import logoGrey from '../../images/icons/logoGrey.svg'
import profil from '../../images/icons/profil.svg'
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
    width: '100%',
    height: '90px',
    padding: theme.spacing(1.5),
    zIndex: '100',
  },
  tabs: {
    '& button': { textTransform: 'none' },
  },
  icons: {
    color: 'rgba(79, 79, 79, 0.5)',
    fontSize: '9px',
    fontWeight: '800',
  },
  logoFull: {
    width: '180px',
  },
  tabsMobileImg: {
    width: '25px',
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

  return (
    <>
      {user.isLoggedIn ? (
        <ConnectedNav />
      ) : matchesXs ? (
        <Paper variant="outlined" square className={classes.xsNav}>
          <Tabs centered variant="fullWidth" className={classes.tabs} value={currentActiveTab}>
            <Tab
              icon={<img src={home} width="25" alt="" className={classes.tabsMobileImg} />}
              label={
                <Box component="span" className={classes.icons}>
                  Accueil
                </Box>
              }
              onClick={() => {
                setCurrentActiveTab('home')
                window.location.href = 'https://explomaker.fr'
              }}
              value="home"
            />
            <Tab
              icon={<img src={logoGrey} width="25" alt="" className={classes.tabsMobileImg} />}
              label={
                <Box component="span" className={classes.icons}>
                  Séjours
                </Box>
              }
              value="inspiration"
              onClick={() => {
                setCurrentActiveTab('inspiration')
                history.push('/')
              }}
            />
            <Tab
              icon={<img src={profil} width="25" alt="" className={classes.tabsMobileImg} />}
              label={
                <Box component="span" className={classes.icons}>
                  Connexion
                </Box>
              }
              onClick={() => {
                setCurrentActiveTab('login')
                setIsLoginModalOpen('login')
              }}
              value="login"
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
                <Button
                  disableRipple
                  className={clsx(classes.navLink)}
                  onClick={() => {
                    window.location.href = 'https://explomaker.fr'
                  }}
                >
                  Accueil
                </Button>
                <Button
                  disableRipple
                  className={clsx(classes.navLink)}
                  onClick={() => history.push('/')}
                >
                  Séjours
                </Button>
                <Button
                  disableRipple
                  className={clsx(classes.navLink, classes.colorPrimaryMain)}
                  onClick={() => setIsLoginModalOpen('login')}
                >
                  Connexion
                </Button>
                <Button
                  disableElevation
                  className={classes.createAccountBtn}
                  onClick={() => setIsLoginModalOpen('signup')}
                >
                  Créer mon compte
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

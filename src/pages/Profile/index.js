import React, { useContext } from 'react'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import makeStyles from '@mui/styles/makeStyles'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'

import { FirebaseContext } from '../../contexts/firebase'
// import Footer from '../../components/molecules/Footer'
import Nav from '../../components/molecules/Nav'
import { SessionContext } from '../../contexts/session'
import Head from '../../components/molecules/Head'

import personRound from '../../images/icons/person-round.svg'
import arrow from '../../images/icons/arrow-back.svg'
import settings from '../../images/icons/settings.svg'
/* import review from '../../images/icons/review.svg' */
import help from '../../images/icons/help.svg'
import logout from '../../images/icons/logout.svg'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.grey.f7,
    width: '100%',
    height: '100%',
    paddingTop: '1px',
    marginTop: '80px',
    [theme.breakpoints.down('sm')]: {
      marginTop: 'unset',
      minHeight: '100vh',
    },
  },
  container: {
    width: '1220px',
    margin: '50px auto',
    minHeight: 'calc(100vh - 81px - 100px)',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '0',
      padding: '50px 20px 34px',
    },
  },
  mainTitle: {
    fontSize: '44px',
    fontWeight: '700',
  },
  papersContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-evenly',
      marginBottom: '90px',
    },
  },
  papers: {
    width: '367px',
    height: '217px',
    cursor: 'pointer',
    padding: '25px',
    textAlign: 'left',
    textTransform: 'unset',
    color: theme.palette.primary.light,
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
    '&:focus': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
    [theme.breakpoints.down('sm')]: {
      height: '100px',
      // '&:nth-child(1), &:nth-child(3)' to use when 'Donne ton avis' will be added
      '&:nth-child(1)': {
        marginBottom: '-20px',
        borderRadius: '20px 20px 0 0',
        height: '85px',
      },
      // '&:nth-child(2), &:nth-child(4)' to use when 'Donne ton avis' will be added
      '&:nth-child(2)': {
        borderRadius: '0 0 20px 20px',
        height: '85px',
      },
    },
  },
  papersContent: {
    display: 'block',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 'max-content',
    [theme.breakpoints.down('sm')]: { width: 'calc(100% - 55px)' },
  },
  papersTitle: {
    fontSize: '20px',
    fontWeight: '500',
    color: theme.palette.grey['33'],
  },
  papersDescription: {
    marginTop: '10px',
    fontSize: '17px',
    color: theme.palette.grey['4f'],
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  logoutPaper: {
    color: theme.palette.secondary.light,
    '&:hover': {
      backgroundColor: theme.palette.secondary.ultraLight,
    },
    '&:focus': {
      backgroundColor: theme.palette.secondary.ultraLight,
    },
  },
}))

const Profile = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { auth, database } = useContext(FirebaseContext)
  const { user } = useContext(SessionContext)

  const logoutHandler = () => {
    auth.signOut().then(() => {
      database.ref(`/status/${user.id}`).set('offline')
      localStorage.removeItem('newTrip')
    })
  }

  return (
    <>
      <Head title="Mon Profil" />
      <Box className={classes.mainContainer}>
        <Nav />
        <Box className={classes.container}>
          <Typography className={classes.mainTitle} variant="h1">
            Profil
          </Typography>
          <Box display={matchesXs ? 'column' : 'flex'} gap="10px" margin="20px 0 30px">
            <Typography sx={{ fontWeight: '500', fontSize: '18px' }}>
              {`${user.firstname} ${user.lastname}`},
            </Typography>
            <Typography sx={{ fontSize: '17px' }}>{user.email}</Typography>
          </Box>
          <Box className={classes.papersContainer}>
            <Paper
              component={Button}
              className={classes.papers}
              onClick={() => {
                history.push('/account')
              }}
            >
              <Box className={classes.papersContent}>
                <img src={personRound} alt="" />
                <Box className={classes.titleContainer}>
                  <Typography className={classes.papersTitle}>Mon compte</Typography>
                  <Box
                    component="img"
                    ml="20px"
                    sx={{ transform: 'rotate(180deg)' }}
                    src={arrow}
                    alt=""
                  />
                </Box>
                <Typography className={classes.papersDescription}>
                  Modifie tes informations personelles, tes identifiants de connexion et ton profil
                  voyageur.
                </Typography>
              </Box>
            </Paper>
            <Paper
              component={Button}
              className={classes.papers}
              onClick={() => {
                history.push('/settings')
              }}
            >
              <Box className={classes.papersContent}>
                <img src={settings} alt="" />
                <Box className={classes.titleContainer}>
                  <Typography className={classes.papersTitle}>Mes préférences</Typography>
                  <Box
                    component="img"
                    ml="20px"
                    sx={{ transform: 'rotate(180deg)' }}
                    src={arrow}
                    alt=""
                  />
                </Box>
                <Typography className={classes.papersDescription}>
                  Modifie tes paramètres de sécurité, tes préférences de notifications et de
                  confidentialité.
                </Typography>
              </Box>
            </Paper>
            {/*           <Paper
            component={Button}
            className={classes.papers}
            onClick={() => {
              history.push('/')
            }}
          >
            <Box className={classes.papersContent}>
              <img src={review} alt="" />
              <Box className={classes.titleContainer}>
                <Typography className={classes.papersTitle}>Donne ton avis</Typography>
                <Box
                  component="img"
                  ml="20px"
                  sx={{ transform: 'rotate(180deg)' }}
                  src={arrow}
                  alt=""
                />
              </Box>
              <Typography className={classes.papersDescription}>
                Aide nous à améliorer ExploMaker en nous donnant ton avis, et tes pistes
                d’améliorations.
              </Typography>
            </Box>
          </Paper> */}
            <Paper
              component={Button}
              className={classes.papers}
              onClick={() => {
                history.push('/help')
              }}
            >
              <Box className={classes.papersContent}>
                <img src={help} alt="" />
                <Box className={classes.titleContainer}>
                  <Typography className={classes.papersTitle}>Aide</Typography>
                  <Box
                    component="img"
                    ml="20px"
                    sx={{ transform: 'rotate(180deg)' }}
                    src={arrow}
                    alt=""
                  />
                </Box>
                <Typography className={classes.papersDescription}>
                  Un problème, une question ? Rejoins notre centre d’aide. Tu y trouveras surement
                  la réponse que tu cherches.
                </Typography>
              </Box>
            </Paper>
            {matchesXs && (
              <Paper
                component={Button}
                className={clsx(classes.papers, classes.logoutPaper)}
                onClick={logoutHandler}
              >
                <Box className={classes.papersContent}>
                  <img src={logout} alt="" />
                  <Box className={classes.titleContainer}>
                    <Typography className={classes.papersTitle}>Me déconnecter</Typography>
                    <Box
                      component="img"
                      ml="20px"
                      sx={{ transform: 'rotate(180deg)' }}
                      src={arrow}
                      alt=""
                    />
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
        {/* <Footer /> */}
      </Box>
    </>
  )
}

export default Profile

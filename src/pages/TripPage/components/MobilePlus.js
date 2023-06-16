import React, { useContext } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import makeStyles from '@mui/styles/makeStyles'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'

// import Footer from '../../../components/molecules/Footer'
import { SessionContext } from '../../../contexts/session'

import arrow from '../../../images/icons/arrow-back.svg'
import help from '../../../images/icons/help.svg'
import bagage from '../../../images/icons/bagage.svg'
import inspiGreen from '../../../images/icons/inspiGreen.svg'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.grey.f7,
    width: '100%',
    height: '100%',
    paddingTop: '1px',
    minHeight: '100vh',
  },
  container: {
    minHeight: 'calc(100vh - 81px  - 100px)',
    width: '100%',
    margin: '0',
    padding: '50px 20px 34px',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '500',
    fontFamily: theme.typography.fontFamily,
  },
  papersContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginBottom: '90px',
  },
  papers: {
    width: '367px',
    height: '100px',
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
  },
  papersContent: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 'calc(100% - 55px)',
  },
  papersTitle: {
    fontSize: '20px',
    fontWeight: '500',
    color: theme.palette.grey['33'],
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
  bgIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.ultraLight,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

const MobilePlus = ({ tripData, tripId, setIsOpen }) => {
  const history = useHistory()
  const classes = useStyles()

  const { user } = useContext(SessionContext)

  return (
    <Box className={classes.mainContainer}>
      <Box className={classes.container}>
        <Typography className={classes.mainTitle} variant="h1">
          {tripData.title}
        </Typography>
        {/* <Box display="column" gap="10px" margin="20px 0 30px">
          <Typography sx={{ fontSize: '17px' }}>Connecté en tant que :</Typography>
          <Typography
            sx={{ fontSize: '17px', textDecoration: 'underline' }}
          >{`${user.firstname} ${user.lastname}`}</Typography>
        </Box> */}
        <Box className={classes.papersContainer}>
          <Paper
            component={Button}
            className={classes.papers}
            onClick={() => {
              history.push(`/tripPage/${tripId}/envies`)
              setIsOpen(false)
            }}
          >
            <Box className={classes.papersContent}>
              <Box className={classes.bgIcon}>
                <img src={inspiGreen} alt="" />
              </Box>
              <Box className={classes.titleContainer}>
                <Typography className={classes.papersTitle}>Inspirations</Typography>
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
            </Box>
          </Paper>
          <Paper
            component={Button}
            className={clsx(classes.papers, classes.logoutPaper)}
            onClick={() => {
              history.push('/')
            }}
          >
            <Box className={classes.papersContent}>
              <img src={bagage} alt="" />
              <Box className={classes.titleContainer}>
                <Typography className={classes.papersTitle}>Mes séjours</Typography>
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
        </Box>
      </Box>
      {/* <Footer /> */}
    </Box>
  )
}

export default MobilePlus

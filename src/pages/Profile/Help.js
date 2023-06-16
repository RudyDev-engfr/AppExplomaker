import React, { useContext } from 'react'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

import { makeStyles, useTheme } from '@mui/styles'
import { useHistory } from 'react-router-dom'

import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import { FirebaseContext } from '../../contexts/firebase'
// import Footer from '../../components/molecules/Footer'
import Nav from '../../components/molecules/Nav'
import Head from '../../components/molecules/Head'

import arrow from '../../images/icons/arrow-back.svg'
import info from '../../images/icons/info-light.svg'
import check from '../../images/icons/check.svg'
import questionMark from '../../images/icons/question-mark.svg'
import message from '../../images/icons/message.svg'
import hammer from '../../images/icons/hammer.svg'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.grey.f7,
    width: '100%',
    height: '100%',
    paddingTop: '1px',
    paddingBottom: '1px',
    marginTop: '80px',
    minHeight: 'calc(100vh - 80px)',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '20%',
      marginTop: 'unset',
      minHeight: 'unset',
    },
  },
  container: {
    width: '1220px',
    margin: '50px auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '0',
      padding: '0 20px 34px',
    },
  },
  breadcrumbsContent: { margin: '20px 0' },
  breadcrumbsBtn: {
    textTransform: 'none',
    fontSize: '16px',
    color: theme.palette.grey['33'],
    padding: '0',
    minWidth: 'unset',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '500',
    color: theme.palette.grey['33'],
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  mainTitleContainerXs: {
    backgroundColor: theme.palette.primary.main,
    height: '143px',
    width: '100%',
    padding: '30px 20px',
  },
  mainTitleXs: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: '500',
    color: 'white',
  },
  closeBtn: {
    position: 'fixed',
    right: '20px',
    top: '20px',
  },
  titles: {
    fontSize: '14px',
    margin: '50px 0 20px',
    color: theme.palette.grey['82'],
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.primary.contrastText,
      height: '50px',
      borderRadius: '20px 20px 0 0',
      marginBottom: '0',
      padding: '30px 25px 0',
    },
  },
  papersContainer: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  papers: {
    width: '335px',
    height: '100px',
    padding: '20px',
    cursor: 'pointer',
    textAlign: 'left',
    textTransform: 'unset',
    color: theme.palette.primary.light,
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
    '&:focus': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100px',
      '&:nth-child(1), &:nth-child(2)': {
        marginBottom: '-20px',
        borderRadius: '0',
        height: '85px',
      },
      '&:nth-child(3), &:nth-child(5)': {
        borderRadius: '0 0 20px 20px',
        height: '85px',
      },
      '&:nth-child(4)': {
        borderRadius: '20px 20px 0 0',
        height: '85px',
        marginTop: '20px',
        marginBottom: '-20px',
      },
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
    fontSize: '16px',
    fontWeight: '500',
    color: theme.palette.grey['33'],
  },
}))

const Help = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { faq } = useContext(FirebaseContext)

  return (
    <>
      <Head title="Aide" />
      <Nav />
      {matchesXs && (
        <Box className={classes.mainTitleContainerXs}>
          <Typography className={classes.mainTitleXs} component="h1">
            Aide
          </Typography>
          <IconButton
            className={classes.closeBtn}
            onClick={() => history.push('/profile')}
            size="large"
          >
            <CloseRoundedIcon style={{ color: 'white' }} />
          </IconButton>
        </Box>
      )}
      <Box className={classes.mainContainer}>
        <Box className={classes.container}>
          {!matchesXs && (
            <Breadcrumbs
              className={classes.breadcrumbsContent}
              separator={<NavigateNextRoundedIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Button className={classes.breadcrumbsBtn} onClick={() => history.push('/profile')}>
                Profil
              </Button>
              <Button className={classes.breadcrumbsBtn} onClick={() => history.push('/settings')}>
                Aide
              </Button>
            </Breadcrumbs>
          )}
          <Typography className={classes.mainTitle} component="h1">
            Aide
          </Typography>
          <Typography className={classes.titles}>Sujets</Typography>
          <Box className={classes.papersContainer}>
            <Paper
              component={Button}
              className={classes.papers}
              onClick={() => {
                history.push(`/help/${faq[0].slug}`)
              }}
            >
              <Box className={classes.papersContent}>
                <img src={info} alt="" />
                <Box className={classes.titleContainer}>
                  <Typography className={classes.papersTitle}>{faq[0].name}</Typography>
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
                history.push(`/help/${faq[1].slug}`)
              }}
            >
              <Box className={classes.papersContent}>
                <img src={check} alt="" />
                <Box className={classes.titleContainer}>
                  <Typography className={classes.papersTitle}>{faq[1].name}</Typography>
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
                history.push(`/help/${faq[2].slug}`)
              }}
            >
              <Box className={classes.papersContent}>
                <img src={questionMark} alt="" />
                <Box className={classes.titleContainer}>
                  <Typography className={classes.papersTitle}>{faq[2].name}</Typography>
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
                window.location.href = 'https://www.explomaker.fr/contact'
              }}
            >
              <Box className={classes.papersContent}>
                <img src={message} alt="" />
                <Box className={classes.titleContainer}>
                  <Typography className={classes.papersTitle}>Nous contacter</Typography>
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
                window.location.href = 'https://www.explomaker.fr/cgu'
              }}
            >
              <Box className={classes.papersContent}>
                <img src={hammer} alt="" />
                <Box className={classes.titleContainer}>
                  <Typography className={classes.papersTitle}>CGU & CGV</Typography>
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
      </Box>
      {/* <Footer /> */}
    </>
  )
}

export default Help

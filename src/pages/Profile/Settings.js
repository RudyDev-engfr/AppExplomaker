import React, { useContext, useState } from 'react'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'

import makeStyles from '@mui/styles/makeStyles'
import { useHistory } from 'react-router-dom'
import { useTheme } from '@emotion/react'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'

import { ArrowBackIos, KeyboardArrowDown } from '@mui/icons-material'
import Footer from '../../components/molecules/Footer'
import Nav from '../../components/molecules/Nav'
import { SessionContext } from '../../contexts/session'
import Switch from '../../components/atoms/Switch'
import Head from '../../components/molecules/Head'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.grey.f7,
    width: '100%',
    height: '100%',
    paddingTop: '1px',
    paddingBottom: '1px',
    marginTop: '80px',
    minHeight: 'calc(100vh - 80px - 370px)',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '100%',
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
      padding: '112px 20px 34px',
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
  },
  titles: {
    fontSize: '18px',
    fontWeight: '500',
    margin: '50px 0 20px',
    color: theme.palette.grey['33'],
  },
  paper: {
    width: '367px',
    height: '118px',
    padding: '15px 20px',
    marginRight: '15px',
    marginBottom: '15px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  papersTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: theme.palette.grey['33'],
  },
  papersDescription: {
    fontSize: '14px',
    color: theme.palette.grey['82'],
    paddingRight: '50px',
    lineHeight: '17px',
    marginTop: '-5px',
    overflowWrap: 'break-word',
  },
  returnBtn: { position: 'absolute', top: '47px', left: '5px' },
  frequencyIcon: {
    marginLeft: theme.spacing(1),
    fontSize: '1rem',
  },
  boldText: {
    fontWeight: 700,
  },
}))

const Settings = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleMenuOpen = event => {
    setIsMenuOpen(true)
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setIsMenuOpen(false)
    setAnchorEl(null)
  }

  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useContext(SessionContext)
  const [emailFrequency, setEmailFrequency] = useState('twice-monthly') // State for storing the selected frequency

  const handleFrequencyChange = selectedFrequency => {
    setEmailFrequency(selectedFrequency)
    user.myTripLetterFrequency = emailFrequency
    console.log(user.myTripLetterFrequency)
    handleMenuClose()
  }

  return (
    <>
      <Head title="Mes Préférences" />
      <Nav />
      <Box className={classes.mainContainer}>
        <Box className={classes.container}>
          <Box>
            {matchesXs && (
              <IconButton
                className={classes.returnBtn}
                onClick={() => history.push('/profile')}
                size="large"
              >
                <ArrowBackIos style={{ transform: 'translate(5px ,0)' }} />
              </IconButton>
            )}
            {!matchesXs && (
              <Breadcrumbs
                className={classes.breadcrumbsContent}
                separator={<NavigateNextRoundedIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                <Button className={classes.breadcrumbsBtn} onClick={() => history.push('/profile')}>
                  Profil
                </Button>
                <Button
                  className={classes.breadcrumbsBtn}
                  onClick={() => history.push('/settings')}
                >
                  Mes préférences
                </Button>
              </Breadcrumbs>
            )}
          </Box>
          <Typography className={classes.mainTitle} component="h1">
            Mes préférences
          </Typography>
          <Typography className={classes.titles}>Emails</Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <Paper className={classes.paper}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography className={classes.papersTitle}>Exploletter</Typography>
                <Switch checked={user.newsletter} target="newsletter" />
              </Box>
              <Typography className={classes.papersDescription}>
                Reçois régulièrement des recommandations d’articles qui pourraient t’intéresser
              </Typography>
            </Paper>
            <Paper className={classes.paper}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography className={classes.papersTitle}>L’actu de mes voyages</Typography>
                <Switch checked={user.myTripLetter} target="myTripLetter" />
              </Box>
              <Typography className={classes.papersDescription}>
                Reçois{' '}
                <Box component="span" className={classes.frequencyTypo}>
                  {emailFrequency === 'daily'
                    ? 'quotidiennement'
                    : emailFrequency === 'weekly'
                    ? '1 fois par semaine'
                    : emailFrequency === 'twice-monthly'
                    ? '2 fois par mois'
                    : emailFrequency === 'monthly'
                    ? 'mensuellement'
                    : emailFrequency}
                </Box>
                <KeyboardArrowDown className={classes.frequencyIcon} onClick={handleMenuOpen} />
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={() => handleFrequencyChange('daily')}>
                    Quotidiennement
                  </MenuItem>
                  <MenuItem onClick={() => handleFrequencyChange('weekly')}>
                    1 fois par semaine
                  </MenuItem>
                  <MenuItem onClick={() => handleFrequencyChange('twice-monthly')}>
                    2 fois par semaine
                  </MenuItem>
                  <MenuItem onClick={() => handleFrequencyChange('monthly')}>
                    Mensuellement
                  </MenuItem>
                </Menu>
                {' les notifications de tes séjours en cours'}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
      {/* <Footer /> */}
    </>
  )
}

export default Settings

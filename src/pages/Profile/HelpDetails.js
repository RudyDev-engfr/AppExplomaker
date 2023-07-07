import React, { useContext, useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import he from 'he'
import { makeStyles, useTheme } from '@mui/styles'

import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded'
import { useParams, useHistory } from 'react-router-dom'
import { FirebaseContext } from '../../contexts/firebase'
import Loader from '../../components/Loader'
// import Footer from '../../components/molecules/Footer'
import Nav from '../../components/molecules/Nav'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.grey.f7,
    width: '100%',
    minHeight: 'calc(100vh - 80px )',
    paddingTop: '1px',
    paddingBottom: '1px',
    marginTop: '80px',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '80px',
      minHeight: 'calc(100vh - 80px)',
      marginTop: 'unset',
    },
  },
  container: {
    width: '1220px',
    margin: '50px auto',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      margin: '0',
      padding: '0 20px 34px',
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
      fontSize: '22px',
      paddingLeft: '8px',
    },
  },
  accordion: {
    borderRadius: '10px',
    marginBottom: '15px',
    '&:first-of-type': {
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
    },
    '&:last-of-type': {
      borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px',
    },
    '&::before': {
      content: 'none',
    },
  },
  accordionTypo: {
    fontSize: '17px',
    color: theme.palette.grey[33],
  },
}))

const HelpDetails = () => {
  const [decodedContent, setDecodedContent] = useState('')
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { slug } = useParams()
  const { faq } = useContext(FirebaseContext)

  const [currentFaq, setCurrentFaq] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [expanded, setExpanded] = useState('')

  useEffect(() => {
    if (faq.length > 0) {
      setCurrentFaq(faq.filter(tempFaq => tempFaq.slug === slug)[0])
      setIsLoading(false)
    }
  }, [faq])

  useEffect(() => {
    if (currentFaq?.items) {
      const parser = new DOMParser()
      const decodedItems = currentFaq.items.map(item => ({
        ...item,
        title: he.decode(item.title),
        content: he.decode(item.content),
      }))
      setCurrentFaq({ ...currentFaq, items: decodedItems })
    }
  }, [currentFaq])

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '')
  }

  return isLoading ? (
    <Loader />
  ) : (
    <>
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
              <Button className={classes.breadcrumbsBtn} onClick={() => history.push('/help')}>
                Aide
              </Button>
              <Button
                className={classes.breadcrumbsBtn}
                onClick={() => history.push(`/help/${slug}`)}
              >
                {currentFaq.name}
              </Button>
            </Breadcrumbs>
          )}
          <Box display="flex" alignItems="center" marginTop="20px">
            {matchesXs && (
              <IconButton
                onClick={() => history.push('/help')}
                size="large"
                sx={{ paddingLeft: '0' }}
              >
                <ArrowBackIosNewRoundedIcon style={{ color: theme.palette.grey.bd }} />
              </IconButton>
            )}
            <Typography className={classes.mainTitle} component="h1">
              {currentFaq.name}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '14px', color: theme.palette.grey[82], marginTop: '30px' }}>
            Questions / Réponses
          </Typography>
          <Box marginTop="20px">
            {currentFaq.items.map((currentItem, itemIndex) => (
              <Accordion
                className={classes.accordion}
                expanded={expanded === `panel${itemIndex}`}
                onChange={handleChange(`panel${itemIndex}`)}
                key={currentItem.title}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: 'rgba(79, 79, 79, 0.5)', fontSize: '40px' }} />
                  }
                >
                  <Typography
                    className={classes.accordionTypo}
                    dangerouslySetInnerHTML={{ __html: currentItem.title }}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    className={classes.accordionTypo}
                    dangerouslySetInnerHTML={{ __html: currentItem.content }}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Box>
      {/* <Footer /> */}
    </>
  )
}

export default HelpDetails

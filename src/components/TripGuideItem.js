import React, { useContext, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import { makeStyles, useTheme } from '@mui/styles'
import { useMediaQuery } from '@mui/material'

import arrowBack from '../images/icons/arrow-back.svg'

import { TripContext } from '../contexts/trip'
import MobileTripPageHeader from './molecules/MobileTripPageHeader'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: 'calc(100vw - 350px)',
    backgroundColor: theme.palette.grey.f7,
    padding: '30px',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      padding: 'unset',
      paddingTop: '30px',
      paddingBottom: '90px',
    },
  },
  breadcrumbsContent: { margin: '20px 0' },
  breadcrumbsBtn: {
    textTransform: 'none',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: 1.5,
    color: theme.palette.grey['33'],
    padding: '0',
    minWidth: 'unset',
  },
  titleTypo: {
    color: theme.palette.grey['33'],
    fontSize: '20px',
    fontWeight: 700,
    lineHeight: '36px',
  },
  accordionContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: '30px',
    },
  },
}))
const TripGuideItem = ({ currentItem, setCurrentSelectedTripGuideButton, setItemData }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { tripId } = useParams()
  const history = useHistory()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { tripData } = useContext(TripContext)
  const [expanded, setExpanded] = useState('')

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '')
  }

  return (
    <Box className={classes.mainContainer}>
      {matchesXs && <MobileTripPageHeader />}
      <Box sx={{ display: 'flex', columnGap: '15px', margin: matchesXs && '30px 0' }}>
        <IconButton
          className={classes.mobileTitleIcon}
          size="large"
          onClick={() => {
            setItemData(null)
            setCurrentSelectedTripGuideButton(null)
            history.push(`/tripPage/${tripId}/tripguide`)
          }}
        >
          <img src={arrowBack} alt="" />
        </IconButton>
        <Typography className={classes.titleTypo}>
          {!matchesXs
            ? `Guide de voyage : ${tripData?.destination?.label}`
            : `${currentItem?.name}`}
        </Typography>
      </Box>
      {!matchesXs && (
        <Box sx={{ display: 'flex' }}>
          <Breadcrumbs
            className={classes.breadcrumbsContent}
            separator={<NavigateNextRoundedIcon sx={{ fontSize: '30px' }} />}
            aria-label="breadcrumb"
          >
            <Button
              className={classes.breadcrumbsBtn}
              onClick={() => {
                setItemData(null)
                setCurrentSelectedTripGuideButton(null)
                history.push(`/tripPage/${tripId}/tripguide`)
              }}
            >
              {currentItem?.category}
            </Button>
            <Button className={classes.breadcrumbsBtn}>{currentItem?.name}</Button>
          </Breadcrumbs>
        </Box>
      )}
      <Box className={classes.accordionContainer}>
        {currentItem?.content.map(({ argumentation, titre }, itemIndex) => (
          <Accordion
            className={classes.accordion}
            expanded={expanded === `panel${itemIndex}`}
            onChange={handleChange(`panel${itemIndex}`)}
            key={titre}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: 'rgba(79, 79, 79, 0.5)', fontSize: '40px' }} />
              }
            >
              <Typography
                className={classes.accordionTypo}
                dangerouslySetInnerHTML={{ __html: titre }}
                sx={{
                  color: expanded === `panel${itemIndex}` && theme.palette.primary.main,
                  fontWeight: 500,
                }}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                className={classes.accordionTypo}
                dangerouslySetInnerHTML={{ __html: argumentation }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  )
}
export default TripGuideItem

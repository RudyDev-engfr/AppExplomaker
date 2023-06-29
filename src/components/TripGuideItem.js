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

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: 'calc(100vw - 350px)',
    backgroundColor: theme.palette.grey.f7,
    padding: '30px',
    paddingTop: '95px',
  },
  breadcrumbsContent: { margin: '20px 0' },
  breadcrumbsBtn: {
    textTransform: 'none',
    fontSize: '28px',
    color: theme.palette.grey['33'],
    padding: '0',
    minWidth: 'unset',
  },
}))
const TripGuideItem = ({ currentItem, setCurrentSelectedButton, setItemData }) => {
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
      {!matchesXs && (
        <Box sx={{ display: 'flex' }}>
          <IconButton
            className={classes.mobileTitleIcon}
            size="large"
            onClick={() => history.goBack()}
          >
            <img src={arrowBack} alt="" />
          </IconButton>
          <Breadcrumbs
            className={classes.breadcrumbsContent}
            separator={<NavigateNextRoundedIcon sx={{ fontSize: '30px' }} />}
            aria-label="breadcrumb"
          >
            <Button
              className={classes.breadcrumbsBtn}
              onClick={() => {
                setItemData(null)
                setCurrentSelectedButton(null)
                history.push(`/tripPage/${tripId}/tripguide`)
              }}
            >
              {tripData?.destination.label}
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

import React, { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useParams } from 'react-router-dom'

import { TripContext } from '../../../contexts/trip'
import CustomAvatar from '../../../components/atoms/CustomAvatar'
import { ROLES } from '../../../helper/constants'

const useStyles = makeStyles(theme => ({
  gridContributeurs: {
    margin: '20px 0',
    display: 'grid',
    gridTemplate: '1fr / max-content 1fr 130px min-content',
    gridGap: '10px',
    alignItems: 'center',
  },
  accordionDetailsGrid: {
    display: 'grid',
    gridTemplate: 'auto / auto',
    gridAutoRows: '60px',
    gridGap: '10px',
    alignItems: 'center',
  },
  accordionDetailsGridRow: {
    width: '100%',
    height: '100%',
    '& button': {
      width: '100%',
      height: '100%',
    },
  },
  ctnContributeurRedButton: {
    alignSelf: 'stretch',
  },
  contributeurRedButton: {
    backgroundColor: theme.palette.secondary.ultraLight,
    color: theme.palette.secondary.main,
    boxShadow: 'unset',
    fontSize: '14px',
    textTransform: 'uppercase',
    fontFamily: theme.typography.fontFamily,
    height: '100%',
    borderRadius: '10px',
  },
}))

const MobileEditEditorGrid = ({ singleTravelerDetails, isAdmin, updateTrip }) => {
  const classes = useStyles()
  const { tripId } = useParams()
  const { tripData } = useContext(TripContext)

  useEffect(() => {
    console.log('singleTravelerDetails', singleTravelerDetails)
    console.log('tripDataowner', tripData.owner)
    console.log('isAdmin', isAdmin)
  }, [singleTravelerDetails, tripData])

  return isAdmin ? (
    tripData.owner === singleTravelerDetails.id ? (
      <>
        <Box className={classes.gridContributeurs}>
          <CustomAvatar peopleIds={[singleTravelerDetails.id]} />
          <Box>
            <Typography variant="h6">{singleTravelerDetails.firstname}</Typography>
            <Typography variant="subtitle2">Propriétaire</Typography>
          </Box>
        </Box>
        <Divider />
      </>
    ) : (
      <Accordion key={singleTravelerDetails.id}>
        <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: '0' }}>
          <Box marginRight="10px">
            <CustomAvatar peopleIds={[singleTravelerDetails.id]} />
          </Box>
          <Box>
            <Typography variant="h6">{singleTravelerDetails.firstname}</Typography>
            <Typography variant="subtitle2">
              {tripData?.owner === singleTravelerDetails?.id
                ? 'Propriétaire'
                : singleTravelerDetails?.role === ROLES.Removed
                ? 'Retiré'
                : null}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails classes={{ root: classes.accordionDetailsGrid }}>
          <Box className={clsx(classes.accordionDetailsGridRow, classes.ctnContributeurRedButton)}>
            {tripData.owner !== singleTravelerDetails.id &&
              (tripData?.editors?.includes(singleTravelerDetails.id) ? (
                <>
                  <Button
                    fullWidth
                    className={classes.contributeurRedButton}
                    color="secondary"
                    onClick={() => {
                      const previousTravelers = [...tripData.travelersDetails]
                      const tempTravelers = previousTravelers.map(traveler => {
                        const tempTraveler = { ...traveler }
                        if (tempTraveler.id === singleTravelerDetails.id) {
                          tempTraveler.role = ROLES.Removed
                        }
                        return tempTraveler
                      })
                      const tempEditors = tripData.editors.filter(
                        editorId => editorId !== singleTravelerDetails.id
                      )
                      updateTrip(tripId, {
                        editors: tempEditors,
                        travelersDetails: tempTravelers,
                      })
                    }}
                  >
                    Retirer
                  </Button>
                </>
              ) : (
                <Button
                  fullWidth
                  className={clsx(classes.accordionDetailsGridRow, classes.contributeurRedButton)}
                  color="secondary"
                  onClick={() => {
                    const previousTravelers = [...tripData.travelersDetails]
                    const tempTravelers = previousTravelers.map(traveler => {
                      const tempTraveler = { ...traveler }
                      if (tempTraveler.id === singleTravelerDetails.id) {
                        tempTraveler.role = ROLES.Write
                      }
                      return tempTraveler
                    })
                    const tempEditors = [...tripData.editors]
                    tempEditors.push(singleTravelerDetails.id)
                    updateTrip(tripId, {
                      editors: tempEditors,
                      travelersDetails: tempTravelers,
                    })
                  }}
                >
                  Réintégrer
                </Button>
              ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    )
  ) : (
    <>
      <Box className={classes.gridContributeurs}>
        <CustomAvatar peopleIds={[singleTravelerDetails.id]} />
        <Box>
          <Typography variant="h6">{singleTravelerDetails.firstname}</Typography>
          <Typography variant="subtitle2">
            {tripData.owner === singleTravelerDetails.id && 'Propriétaire'}
          </Typography>
        </Box>
      </Box>
      <Divider />
    </>
  )
}
export default MobileEditEditorGrid

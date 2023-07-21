import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles, useTheme } from '@mui/styles'
import { v4 as uuidv4 } from 'uuid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import CustomAvatar from '../../../components/atoms/CustomAvatar'

import { TripContext } from '../../../contexts/trip'
import { ROLES } from '../../../helper/constants'

const useStyles = makeStyles(theme => ({
  ctnContributeurRedButton: {
    alignSelf: 'stretch',
  },
  contributeurRedButton: {
    backgroundColor: `${theme.palette.secondary.ultraLight} !important`,
    color: theme.palette.secondary.main,
    boxShadow: 'unset',
    fontSize: '14px',
    textTransform: 'uppercase',
    fontFamily: theme.typography.fontFamily,
    height: '100%',
    borderRadius: '10px',
  },
  gridContributeurs: {
    margin: '20px 0',
    display: 'grid',
    gridTemplate: '1fr / max-content 1fr 130px min-content',
    gridGap: '10px',
    alignItems: 'center',
  },
  redBtnRoot: {
    '&:hover': {
      backgroundColor: theme.palette.secondary.ultraLight,
      opacity: 1,
    },
  },
}))

const DesktopEditEditorGrid = ({ singleTravelerDetails, isAdmin, updateTrip }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { tripId } = useParams()
  const { tripData } = useContext(TripContext)

  return (
    <React.Fragment key={uuidv4()}>
      <Box className={classes.gridContributeurs}>
        <CustomAvatar peopleIds={[singleTravelerDetails?.id]} />
        <Box>
          <Typography variant="h6">{singleTravelerDetails?.firstname}</Typography>
          <Typography variant="subtitle2">
            {tripData?.owner === singleTravelerDetails?.id && 'Propriétaire'}
            {singleTravelerDetails?.role === ROLES.Removed && 'Retiré'}
          </Typography>
        </Box>
        {isAdmin && (
          <Box className={classes.ctnContributeurRedButton}>
            {tripData?.owner !== singleTravelerDetails?.id &&
              (tripData?.editors?.includes(singleTravelerDetails.id) ? (
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
                  classes={{ root: classes.redBtnRoot }}
                >
                  Retirer
                </Button>
              ) : (
                <Button
                  fullWidth
                  className={classes.contributeurRedButton}
                  color="secondary"
                  onClick={() => {
                    const previousTravelers = [...tripData?.travelersDetails]
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
                  classes={{ root: classes.redBtnRoot }}
                >
                  Réintégrer
                </Button>
              ))}
          </Box>
        )}
      </Box>
      <Divider />
    </React.Fragment>
  )
}
export default DesktopEditEditorGrid

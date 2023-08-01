import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { makeStyles, useTheme } from '@mui/styles'
import ShareIcon from '@mui/icons-material/Share'
import { toast } from 'react-toastify'
import StarIcon from '@mui/icons-material/Star'
import calendar from '../../images/icons/calendar.svg'
import location from '../../images/icons/location.svg'
import person from '../../images/icons/person.svg'

import CustomAvatar from '../../components/atoms/CustomAvatar'
import { TripContext } from '../../contexts/trip'
import AddCollaboratorsButton from '../../components/atoms/AddCollaboratorsButton'
import { ROLES } from '../../helper/constants'

const useStyles = makeStyles(theme => ({
  generalInformationBlock: {
    padding: '30px',
    backgroundColor: 'white',
  },
  subtitle: {
    fontWeight: '500',
    fontSize: '14px',
    marginRight: '20px',
  },
  mobileIcon: {
    marginRight: '10px',
  },
}))
const DesktopPreview = ({ tripData, generatedAvatars }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { tripId } = useParams()
  const { setOpenModal, currentDateRange } = useContext(TripContext)

  return (
    <Box className={classes.generalInformationBlock}>
      <Box display="flex" alignItems="flex-start" mb="20px" justifyContent="space-between">
        <Typography variant="h1">{tripData.title}</Typography>
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              backgroundColor: tripData.premium
                ? theme.palette.primary.main
                : theme.palette.secondary.main,
              color: 'white',
              fontSize: '25px',
              fontWeight: '700',
              lineHeight: '1',
              padding: '5px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '10px', // Ajuster la marge à gauche
            }}
          >
            {tripData.premium ? (
              <>
                Premium
                <StarIcon
                  sx={{
                    marginLeft: '2px',
                    fontSize: '25px',
                  }}
                />
              </>
            ) : (
              'Gratuit'
            )}
          </Box>
        </Box>

        {/* <IconButton
          onClick={() => {
            navigator.clipboard.writeText(
              `https://${window.location.href.split('/')[2]}/join/${tripId}`
            )
            toast.success('Lien copié !')
          }}
        >
          <ShareIcon />
        </IconButton> */}
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Box display="flex" alignItems="center">
          <img src={calendar} alt="" className={classes.mobileIcon} />
          {currentDateRange[0] !== '' ? (
            <Button
              onClick={() => setOpenModal('editDate')}
              sx={{
                textDecoration: 'none',
                textTransform: 'none',
                color: theme.palette.grey['33'],
              }}
            >
              <Typography component="h4" className={classes.subtitle}>
                {currentDateRange[0]} - {currentDateRange[1]}
              </Typography>
            </Button>
          ) : (
            <Button
              onClick={() => setOpenModal('editDate')}
              sx={{
                textDecoration: 'none',
                textTransform: 'none',
                color: theme.palette.grey['33'],
              }}
            >
              A définir
            </Button>
          )}
        </Box>
        <Box display="flex" alignItems="center">
          <img src={location} alt="" className={classes.mobileIcon} />
          {!tripData.noDestination ? (
            <Button
              onClick={() => setOpenModal('editDestination')}
              sx={{
                textDecoration: 'none',
                textTransform: 'none',
                color: theme.palette.grey['33'],
              }}
            >
              <Typography component="h4" className={classes.subtitle}>
                {tripData.destination.label}
              </Typography>
            </Button>
          ) : (
            <Button
              onClick={() => setOpenModal('editDestination')}
              sx={{
                textDecoration: 'none',
                textTransform: 'none',
                color: theme.palette.grey['33'],
              }}
            >
              A définir
            </Button>
          )}
        </Box>
        <Box display="flex" alignItems="center" marginRight="20px">
          <img src={person} alt="" className={classes.mobileIcon} />
          <Button
            onClick={() => setOpenModal('editEditors')}
            sx={{
              textDecoration: 'none',
              textTransform: 'none',
              color: theme.palette.grey['33'],
            }}
          >
            <Typography className={classes.subtitle} component="h4">
              {
                tripData.travelersDetails.filter(
                  traveler => traveler.id && traveler.role !== ROLES.Removed
                ).length
              }{' '}
              contributeur
              {tripData.travelersDetails.filter(
                traveler => traveler.id && traveler.role !== ROLES.Removed
              ).length > 1
                ? 's'
                : ''}
            </Typography>
          </Button>
        </Box>
        <Box display="flex" alignItems="center" ml="auto">
          <AddCollaboratorsButton tripId={tripId} />
          <CustomAvatar peopleIds={generatedAvatars} isPreview />
        </Box>
      </Box>
    </Box>
  )
}
export default DesktopPreview

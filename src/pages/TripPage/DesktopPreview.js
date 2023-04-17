import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import ShareIcon from '@mui/icons-material/Share'
import { toast } from 'react-toastify'

import calendar from '../../images/icons/calendar.svg'
import location from '../../images/icons/location.svg'
import person from '../../images/icons/person.svg'

import CustomAvatar from '../../components/atoms/CustomAvatar'
import { TripContext } from '../../contexts/trip'

const useStyles = makeStyles(theme => ({
  generalInformationBlock: {
    padding: '30px 0 30px 15px',
    backgroundColor: 'white',
  },
  subtitle: {
    fontWeight: '500',
    fontSize: '14px',
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
      <Box
        display="flex"
        alignItems="flex-start"
        width="calc(100% - 50px)"
        mb="20px"
        justifyContent="space-between"
      >
        <Typography variant="h1">{tripData.title}</Typography>
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
      <Box sx={{ display: 'grid', alignItems: 'center', gridTemplate: '1fr / 1fr 1fr 1fr 2fr' }}>
        <Box display="flex" alignItems="center">
          <img src={calendar} alt="" className={classes.mobileIcon} />
          {currentDateRange[0] !== '' ? (
            <Typography className={classes.subtitle}>
              {currentDateRange[0]}
              {' - '}
              {currentDateRange[1]}
            </Typography>
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
            <Typography className={classes.subtitle}>{tripData.destination.label}</Typography>
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
        <Box display="flex" alignItems="center">
          <img src={person} alt="" className={classes.mobileIcon} />
          <Typography className={classes.subtitle}>
            {tripData.editors.length} participant{tripData.editors.length > 1 ? 's' : ''}
          </Typography>
        </Box>
        <Box sx={{ alignSelf: 'flex-end' }}>
          <CustomAvatar peopleIds={generatedAvatars} isPreview />
        </Box>
      </Box>
    </Box>
  )
}
export default DesktopPreview

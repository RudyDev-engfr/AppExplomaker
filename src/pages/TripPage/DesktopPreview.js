import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, IconButton, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ShareIcon from '@mui/icons-material/Share'
import { toast } from 'react-toastify'

import calendar from '../../images/icons/calendar.svg'
import location from '../../images/icons/location.svg'
import person from '../../images/icons/person.svg'

import CustomAvatar from '../../components/atoms/CustomAvatar'
import EditBtn from '../../components/atoms/EditBtn'

const useStyles = makeStyles(theme => ({
  generalInformationBlock: {
    padding: '30px 0 30px 30px',
    backgroundColor: 'white',
  },
  subtitle: {
    fontWeight: '500',
    fontSize: '20px',
  },
  mobileIcon: {
    marginRight: '15px',
  },
}))
const DesktopPreview = ({ tripData, generatedAvatars, currentDateRange }) => {
  const classes = useStyles()
  const { tripId } = useParams()

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
        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(
              `https://${window.location.href.split('/')[2]}/join/${tripId}`
            )
            toast.success('Lien copié !')
          }}
        >
          <ShareIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'grid', alignItems: 'center', gridTemplate: '1fr / 1fr 1fr 1fr 2fr' }}>
        <Box display="flex" alignItems="center">
          <img src={calendar} alt="" className={classes.mobileIcon} />
          {currentDateRange && (
            <Typography className={classes.subtitle}>{currentDateRange[0]}</Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center">
          <img src={location} alt="" className={classes.mobileIcon} />
          <Typography className={classes.subtitle}>
            {!tripData.noDestination && tripData.destination.label}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <img src={person} alt="" className={classes.mobileIcon} />
          <Typography className={classes.subtitle}>
            {tripData.editors.length} contributeur{tripData.editors.length > 1 ? 's' : ''}
          </Typography>
        </Box>
        <CustomAvatar peopleIds={generatedAvatars} />
      </Box>
    </Box>
  )
}
export default DesktopPreview

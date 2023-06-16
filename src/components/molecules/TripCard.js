import React, { useContext, useEffect } from 'react'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'
import { Event, LocationOn, Notifications } from '@mui/icons-material'
import { useHistory } from 'react-router-dom'
import { isWithinInterval } from 'date-fns'

import StarIcon from '@mui/icons-material/Star'
import CustomAvatar from '../atoms/CustomAvatar'
import { rCTFF } from '../../helper/functions'
import { SessionContext } from '../../contexts/session'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    position: 'relative',
    boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04), 0px 2px 8px rgba(0, 0, 0, 0.03)',
    borderRadius: '20px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '38px',
      maxWidth: '300px',
      minWidth: '300px',
    },
    '@media screen and (max-width: 350px)': {
      maxWidth: '260px',
      minWidth: '260px',
    },
  },
  image: {
    borderRadius: '10px',
    width: 'calc(100% - 2rem)',
    height: '184px',
    margin: '1rem auto',
    position: 'relative',
  },
  /*   button: {
    borderRadius: '10px',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    fontSize: '2rem',
    padding: '.75rem 1.25rem',
    minWidth: 'max-content',
    marginLeft: theme.spacing(1),
  }, */
  actionArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
  },
  cardContent: {
    flexGrow: '1',
    width: '100%',
  },
  iconBtn: {
    backgroundColor: 'white',
    color: theme.palette.grey[400],
    transform: 'rotate(-15deg)',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
  icons: {
    color: theme.palette.grey[400],
    marginRight: theme.spacing(1),
  },
}))

const TripCard = ({
  bgImg,
  people,
  title,
  date,
  destination,
  tripId,
  startDate,
  endDate,
  premium = false,
}) => {
  const classes = useStyles()
  const history = useHistory()
  const theme = useTheme()
  const { user } = useContext(SessionContext)

  return (
    <Card className={classes.root}>
      {user.notifications?.filter(
        notification => notification?.tripId === tripId && notification?.state === 1
      ).length > 0 && (
        <Box position="absolute" top="calc(4% + 1rem)" right="calc(4% + 1rem)" zIndex={10}>
          <Badge
            badgeContent={
              user.notifications?.filter(
                notification => notification?.tripId === tripId && notification?.state === 1
              ).length
            }
            color="secondary"
            overlap="circular"
          >
            <IconButton
              className={classes.iconBtn}
              size="large"
              disabled={
                user.notifications?.filter(
                  notification => notification?.tripId === tripId && notification?.state === 1
                ).length === 0
              }
              sx={{
                backgroundColor:
                  user.notifications?.filter(
                    notification => notification?.tripId === tripId && notification?.state === 1
                  ).length > 0
                    ? `${theme.palette.primary.ultraLight} !important`
                    : `${theme.palette.grey.bd}!important`,
              }}
            >
              <Notifications
                sx={{
                  color:
                    user.notifications?.filter(
                      notification => notification?.tripId === tripId && notification.state === 1
                    ).length > 0
                      ? `${theme.palette.primary.main} !important`
                      : `${theme.palette.grey.bd}!important`,
                }}
              />
            </IconButton>
          </Badge>
        </Box>
      )}
      <CardActionArea
        onClick={() => history.push(`/tripPage/${tripId}`)}
        className={classes.actionArea}
      >
        <CardMedia className={classes.image} image={bgImg}>
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                backgroundColor: premium
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
                lineHeight: '1',
                padding: '5px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                marginRight: premium && '4px',
              }}
            >
              {premium ? 'Premium' : 'Gratuit'}
              {premium && (
                <StarIcon
                  sx={{
                    marginLeft: '2px',
                    fontSize: '16px',
                  }}
                />
              )}
            </Box>
          </Box>
          <Box position="absolute" bottom="8%" right="6%">
            <CustomAvatar peopleIds={people} />
          </Box>
        </CardMedia>
        <CardContent className={classes.cardContent}>
          <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h5">{title}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="flex-end">
              <Box>
                <Box display="flex" alignItems="center">
                  <Event className={classes.icons} />
                  <Typography>{date}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <LocationOn className={classes.icons} />
                  <Typography>{destination}</Typography>
                </Box>
                {startDate !== '' &&
                  endDate !== '' &&
                  isWithinInterval(new Date(), {
                    start: rCTFF(startDate),
                    end: rCTFF(endDate),
                  }) && (
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        display: 'flex',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        position: 'absolute',
                        right: '14px',
                        bottom: '14px',
                        maxWidth: '130px',
                        maxHeight: '60px',
                        padding: '5px',
                        border: '3px solid white',
                      }}
                    >
                      <Typography
                        sx={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '700',
                          lineHeight: '28px',
                        }}
                      >
                        En cours
                      </Typography>
                    </Box>
                  )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default TripCard

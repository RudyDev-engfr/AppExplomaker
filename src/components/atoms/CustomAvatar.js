import React, { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Avatar, AvatarGroup, Badge, Box, Fade, Tooltip } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { FavoriteRounded } from '@mui/icons-material'

import { FirebaseContext } from '../../contexts/firebase'

const useStyles = makeStyles(theme => ({
  verticalGroup: {
    flexDirection: 'column',
  },
  horizontalGroup: { justifyContent: 'flex-end' },
  verticalAvatar: {
    marginTop: '-8px',
    marginLeft: '0',
  },
  tooltip: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '5px',
  },
  arrow: {
    color: theme.palette.primary.main,
  },
  badge: {
    height: '18px',
    width: '18px',
    minWidth: '18px',
    borderRadius: '50%',
    fontSize: '10px',
  },
}))

const CustomAvatar = ({
  persons = [],
  peopleIds = [],
  isVertical = false,
  propsClasses,
  isLike = false,
  width = 44,
  height = 44,
  isNotification,
}) => {
  const classes = useStyles()
  const { getUserById } = useContext(FirebaseContext)
  const [currentTravelers, setCurrentTravelers] = useState([])

  useEffect(() => {
    const batchGetUsers = []
    peopleIds.forEach(peopleId => {
      if (peopleId?.id) {
        batchGetUsers.push(getUserById(peopleId.id))
      } else if (peopleId?.name) {
        batchGetUsers.push(new Promise(resolve => resolve({ firstname: peopleId.name })))
      } else {
        batchGetUsers.push(getUserById(peopleId))
      }
    })
    Promise.all(batchGetUsers).then(response => {
      if (response.length > 0) {
        const tempTravelers = response.map(({ firstname, avatar }) => ({ firstname, avatar }))
        setCurrentTravelers(tempTravelers)
      }
    })
  }, [peopleIds])

  return (
    <Box className={propsClasses}>
      <AvatarGroup
        classes={
          isVertical
            ? { root: classes.verticalGroup, avatar: classes.verticalAvatar }
            : { root: classes.horizontalGroup }
        }
        max={isVertical ? 4 : 5}
      >
        {peopleIds.length > 0
          ? currentTravelers.map(({ firstname, avatar }) => (
              <Tooltip
                arrow
                key={uuidv4()}
                title={firstname}
                classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
                TransitionComponent={Fade}
              >
                {isLike ? (
                  <Badge
                    classes={{
                      badge: classes.badge,
                    }}
                    overlap="circular"
                    color="primary"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    badgeContent={<FavoriteRounded fontSize="inherit" />}
                  >
                    <Avatar variant="circular" src={avatar} alt={firstname}>
                      {firstname?.substring(0, 1)}
                    </Avatar>
                  </Badge>
                ) : (
                  <Avatar
                    variant="circular"
                    src={avatar}
                    alt={firstname}
                    sx={{
                      width,
                      height,
                      border: isNotification && '1px solid lightgrey !important',
                    }}
                  >
                    {firstname?.substring(0, 1)}
                  </Avatar>
                )}
              </Tooltip>
            ))
          : persons.length > 0 &&
            persons.map(person => (
              <Tooltip
                arrow
                key={uuidv4()}
                title={person.name}
                classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
                TransitionComponent={Fade}
              >
                <Avatar variant="circular" src={person.avatar} alt={person.name} />
              </Tooltip>
            ))}
      </AvatarGroup>
    </Box>
  )
}
export default CustomAvatar

import { ArrowForward, Notifications } from '@mui/icons-material'
import { Avatar, Badge, Box, IconButton, Modal, Paper, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import React, { useState } from 'react'
import findIcon from '../../helper/icons'
import CustomAvatar from '../atoms/CustomAvatar'

const useStyles = makeStyles(theme => ({
  notificationTitle: {
    fontSize: '28px',
    lineHeight: '32px',
    fontFamily: 'Vesper Libre',
  },
}))

const MobileNotificationArea = ({ tripData, currentNotifications, setRefreshNotif }) => {
  const classes = useStyles()
  const theme = useTheme()

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <>
      <IconButton
        onClick={() => {
          setRefreshNotif(true)
          handleOpen()
        }}
      >
        <Notifications />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-notifications"
        aria-describedby="modal-show-notifications"
      >
        <Paper
          sx={{
            width: '100vw',
            height: 'calc(100vh - 60px)',
            padding: '60px 15px 30px 15px',
            zIndex: 9999,
            borderRadius: 0,
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 15px',
              marginBottom: '30px',
            }}
          >
            <Typography className={classes.notificationTitle}>Notifications</Typography>
            <IconButton onClick={() => handleClose()}>
              <ArrowForward sx={{ fontSize: '28 px', color: theme.palette.grey.bd }} />
            </IconButton>
          </Box>
          {currentNotifications.map(notification => (
            <Box
              sx={{
                width: 'calc(100vw - 30px),',
                height: '113px',
                padding: '0 30px',
                display: 'grid',
                gridTemplate: '1fr / 110px 1fr',
                alignItems: 'center',
                marginBottom: '30px',
                borderRadius: '20px',
                backgroundColor:
                  notification.state === 1 ? theme.palette.primary.ultraLight : 'white',
              }}
              key={notification.content}
            >
              <Box sx={{ position: 'relative' }}>
                <CustomAvatar
                  width={54}
                  height={54}
                  peopleIds={[notification.owner]}
                  isNotification
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '-5px ',
                    right: '50px',
                    padding: '6px',
                    borderRadius: '50px',
                    width: '32px',
                    height: '32px',
                    backgroundColor: theme.palette.primary.main,
                  }}
                >
                  <Box
                    component="img"
                    src={findIcon(notification.icon, notification.eventType)}
                    sx={{
                      filter:
                        'brightness(0) saturate(100%) invert(92%) sepia(95%) saturate(0%) hue-rotate(332deg) brightness(114%) contrast(100%)',
                      width: '20px',
                      height: '20px',
                    }}
                  />
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '13px' }}>{notification.content}</Typography>
                <Typography sx={{ fontSize: '13px', color: theme.palette.primary.main }}>
                  {notification.timer}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Modal>
    </>
  )
}

export default MobileNotificationArea

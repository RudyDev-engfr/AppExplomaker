import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import EventNoteIcon from '@mui/icons-material/EventNote'
/* import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined' */
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import {
  Badge,
  Box,
  Button,
  Dialog,
  Paper,
  Slide,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FeedIcon from '@mui/icons-material/Feed'

import logoFull from '../../../images/icons/logoFull.svg'
import planning from '../../../images/icons/planning.svg'
import planningGreen from '../../../images/icons/planningGreen.svg'
/* import photo from '../../../images/icons/photo.svg'
import photoGreen from '../../../images/icons/photoGreen.svg' */
import plus from '../../../images/icons/plus.svg'
import plusGreen from '../../../images/icons/plusGreen.svg'
import apercu from '../../../images/icons/apercu.svg'
import apercuGreen from '../../../images/icons/apercuGreen.svg'
import MobilePlus from './MobilePlus'
import TitleArea from './TitleArea'

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />)

const useStyles = makeStyles(theme => ({
  container: {
    position: 'fixed',
    borderRadius: '0',
    top: '0',
    left: '0',
    height: '100vh',
    width: '350px',
    zIndex: '1',
    display: 'grid',
    gridTemplate: 'min-content max-content 1fr min-content / 1fr',
    '@media (max-width: 1060px)': {
      width: '240px',
    },
  },
  sidebarButton: {
    padding: '15px 50px 15px 20px',
    display: 'flex',
    alignItems: 'center',
    color: '#000000',
    textTransform: 'unset',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderRadius: '25px 0 0 25px',
    transition: '0.2s background-color linear',
    justifyContent: 'flex-start',
    position: 'relative',
    left: '30px',
    width: 'calc(100% - 30px)',
    '&:hover': {
      background: '#f7f7f7',
      color: '#009d8c',
    },
    '@media (max-width: 1060px)': {
      paddingLeft: '15px',
      left: '0',
      width: '100%',
    },
  },
  activeTabStyle: {
    position: 'relative',
    left: '30px',
    background: '#f7f7f7',
    color: '#009d8c',
    borderRadius: '25px 0 0 25px',
    paddingLeft: '20px',
    '&::before': {
      content: `""`,
      width: '10px',
      top: '0',
      left: '-30px',
      borderRadius: '0 25px 25px 0',
      height: '100%',
      backgroundColor: '#009d8c',
      position: 'absolute',
    },
    '@media (max-width: 1060px)': {
      left: '0',
      paddingLeft: '15px',
      '&::before': {
        left: '0',
      },
    },
  },
  returnButton: {
    padding: '15px 50px',
    color: '#000000',
    textTransform: 'unset',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderRadius: '0 25px 25px 0',
    position: 'relative',
    transition: '0.2s background-color linear',
    '&:hover': {
      left: '0',
      background: '#f7f7f7',
      color: '#009d8c',
    },
    '@media (max-width: 1060px)': {
      padding: '15px',
    },
  },
  icons: {
    fontSize: '1.5rem!important',
    position: 'relative',
    top: '-.05rem',
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  xsNav: {
    backgroundColor: 'white',
    position: 'fixed',
    bottom: '0',
    width: '100%',
    height: '90px',
    padding: `${theme.spacing(1.5)} ${theme.spacing(0.5)} ${theme.spacing(1.5)} !important`,
    zIndex: '10000',
  },
  spanNav: {
    color: 'rgba(79, 79, 79, 0.5)',
    fontSize: '9px',
    fontWeight: '800',
  },
  activeMobileTabStyle: {
    color: theme.palette.primary.main,
  },
}))

const TripPageNav = ({
  currentActiveTab,
  setCurrentActiveTab,
  tripId,
  tripData,
  currentDateRange,
  currentPlanningNotifications,
}) => {
  const history = useHistory()
  const classes = useStyles()
  const matches1060 = useMediaQuery('(max-width:1060px)')
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  const [isMobilePlusOpen, setIsMobilePlusOpen] = useState(false)

  const handleMobileNavigation = target => {
    if (isMobilePlusOpen) {
      setIsMobilePlusOpen(false)
    }
    setCurrentActiveTab(target)
  }

  return !isXs ? (
    <Paper className={classes.container}>
      <Box p={matches1060 ? '15px 15px 10px 15px' : '50px 50px 35px 50px'}>
        <img src={logoFull} alt="" />
      </Box>
      <TitleArea
        tripDestinationLabel={tripData.destination?.label}
        tripTitle={tripData.title}
        tripDateRange={currentDateRange}
      />
      <Box display="flex" flexDirection="column">
        <Button
          className={clsx(classes.sidebarButton, {
            [classes.activeTabStyle]: currentActiveTab === 'preview',
          })}
          onClick={() => setCurrentActiveTab('preview')}
          startIcon={
            <DashboardOutlinedIcon
              color={currentActiveTab === 'preview' ? 'primary' : 'disabled'}
              className={classes.icons}
            />
          }
        >
          Aperçu
        </Button>
        <Button
          className={clsx(classes.sidebarButton, {
            [classes.activeTabStyle]: currentActiveTab === 'envies',
          })}
          onClick={() => setCurrentActiveTab('envies')}
          startIcon={
            <StarBorderIcon
              color={currentActiveTab === 'envies' ? 'primary' : 'disabled'}
              className={classes.icons}
            />
          }
        >
          Envies
        </Button>
        <Button
          className={clsx(classes.sidebarButton, {
            [classes.activeTabStyle]: currentActiveTab === 'planning',
          })}
          onClick={() => {
            history.push(`/tripPage/${tripId}/planning`)
          }}
          startIcon={
            <EventNoteIcon
              color={currentActiveTab === 'planning' ? 'primary' : 'disabled'}
              className={classes.icons}
            />
          }
          sx={{ position: 'relative' }}
        >
          Planning
          {currentPlanningNotifications.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                backgroundColor: theme.palette.secondary.main,
                width: '18px',
                height: '18px',
                borderRadius: '50px',
                padding: '5px',
                right: '25px',
                zIndex: 1000000,
                color: 'white',
                fontSize: '9px',
                fontWeight: 500,
                lineHeight: '10.67px',
              }}
            >
              {currentPlanningNotifications.length}
            </Box>
          )}
        </Button>
        <Button
          className={clsx(classes.sidebarButton, {
            [classes.activeTabStyle]: currentActiveTab === 'triplogs',
          })}
          onClick={() => setCurrentActiveTab('triplogs')}
          startIcon={
            <FeedIcon
              color={currentActiveTab === 'triplogs' ? 'primary' : 'disabled'}
              className={classes.icons}
            />
          }
        >
          Logs
        </Button>
        {/* <Button
              className={clsx(classes.sidebarButton, {
                [classes.activeTabStyle]: currentActiveTab === 'photos',
              })}
              onClick={() => setCurrentActiveTab('photos')}
              startIcon={
                <PhotoCameraOutlinedIcon
                  color={currentActiveTab === 'photos' ? 'primary' : 'disabled'}
                  className={classes.icons}
                />
              }
            >
              Photos
            </Button>
            <Button
              className={clsx(classes.sidebarButton, {
                [classes.activeTabStyle]: currentActiveTab === 'documents',
              })}
              onClick={() => setCurrentActiveTab('documents')}
              startIcon={
                <InsertDriveFileOutlinedIcon
                  color={currentActiveTab === 'documents' ? 'primary' : 'disabled'}
                  className={classes.icons}
                />
              }
            >
              Documents
            </Button>
            <Button
              className={clsx(classes.sidebarButton, {
                [classes.activeTabStyle]: currentActiveTab === 'notes',
              })}
              onClick={() => setCurrentActiveTab('notes')}
              startIcon={
                <NoteOutlinedIcon
                  color={currentActiveTab === 'notes' ? 'primary' : 'disabled'}
                  className={classes.icons}
                />
              }
            >
              Notes
            </Button>
            <Button
              className={clsx(classes.sidebarButton, {
                [classes.activeTabStyle]: currentActiveTab === 'inspiration',
              })}
              onClick={() => setCurrentActiveTab('inspiration')}
              startIcon={
                <EmojiObjectsOutlinedIcon
                  color={currentActiveTab === 'inspiration' ? 'primary' : 'disabled'}
                  className={classes.icons}
                />
              }
            >
              Inspiration
            </Button> */}
      </Box>
      <Box>
        <Button
          className={classes.returnButton}
          onClick={() => history.push('/')}
          startIcon={
            <Box mr={1.5} display="flex" alignItems="center">
              <ArrowBackRoundedIcon />
            </Box>
          }
        >
          Mes séjours
        </Button>
      </Box>
    </Paper>
  ) : (
    <>
      <Paper variant="outlined" square className={classes.xsNav}>
        <Tabs
          centered
          variant="fullWidth"
          value={currentActiveTab}
          sx={{ [theme.breakpoints.down('sm')]: { '& button': { minWidth: '20vw !important' } } }}
          TabIndicatorProps={{ sx: { display: 'none' } }}
        >
          <Tab
            icon={
              <img
                src={!isMobilePlusOpen && currentActiveTab === 'preview' ? apercuGreen : apercu}
                alt=""
              />
            }
            label={
              <Box
                component="span"
                className={clsx(classes.spanNav, {
                  [classes.activeMobileTabStyle]:
                    !isMobilePlusOpen && currentActiveTab === 'preview',
                })}
              >
                Aperçu
              </Box>
            }
            onClick={() => handleMobileNavigation('preview')}
            value="preview"
          />
          <Badge
            color="secondary"
            overlap="circular"
            component="div"
            badgeContent={currentPlanningNotifications.length}
            sx={{ color: 'unset !important', opacity: 100, bgcolor: 'unset' }}
          >
            <Tab
              icon={
                <img
                  src={
                    !isMobilePlusOpen && currentActiveTab === 'planning' ? planningGreen : planning
                  }
                  alt=""
                />
              }
              label={
                <Box
                  component="span"
                  className={clsx(classes.spanNav, {
                    [classes.activeMobileTabStyle]:
                      !isMobilePlusOpen && currentActiveTab === 'planning',
                  })}
                >
                  Planning
                </Box>
              }
              onClick={() => handleMobileNavigation('planning')}
              value="planning"
            />
          </Badge>

          {/* <Tab
          icon={<img src={currentActiveTab === 'photos' ? photoGreen : photo} alt="" />}
          label={
            <Box
              component="span"
              className={clsx(classes.spanNav, {
                [classes.activeMobileTabStyle]: currentActiveTab === 'photos',
              })}
            >
              Photo
            </Box>
          }
          onClick={() => setCurrentActiveTab('photos')}
          value="photos"
        /> */}
          <Tab
            icon={<FavoriteIcon />}
            label={
              <Box
                component="span"
                className={clsx(classes.spanNav, {
                  [classes.activeMobileTabStyle]:
                    !isMobilePlusOpen && currentActiveTab === 'envies',
                })}
              >
                Envies
              </Box>
            }
            onClick={() => handleMobileNavigation('envies')}
            value="envies"
          />
          <Tab
            icon={<img src={isMobilePlusOpen ? plusGreen : plus} alt="" />}
            label={
              <Box
                className={clsx(classes.spanNav, {
                  [classes.activeMobileTabStyle]: isMobilePlusOpen,
                })}
                component="span"
              >
                Plus
              </Box>
            }
            onClick={() => {
              setIsMobilePlusOpen(true)
            }}
            value="plus"
          />
        </Tabs>
      </Paper>

      <Dialog
        fullScreen
        open={isMobilePlusOpen}
        onClose={() => setIsMobilePlusOpen(false)}
        TransitionComponent={Transition}
      >
        <MobilePlus tripData={tripData} tripId={tripId} setIsOpen={setIsMobilePlusOpen} />
      </Dialog>
    </>
  )
}

export default TripPageNav

import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/'

import makeStyles from '@mui/styles/makeStyles'
import { useHistory } from 'react-router-dom'
import { Check } from '@mui/icons-material'
import clsx from 'clsx'
import Carousel from 'react-multi-carousel'

import Wrapper from './Wrapper'
import { FirebaseContext } from '../../contexts/firebase'
import { arrayShuffle, filterObjectByValue } from '../../helper/functions'
import { SessionContext } from '../../contexts/session'

const useStyles = makeStyles(theme => ({
  travelPflBtnContainer: {
    display: 'flex',
    gap: '15px',
    width: 'max-content',
    padding: '0 32px',
  },
  travelerProfileTitle: {
    fontSize: '18px',
    fontWeight: '500',
    color: theme.palette.grey[33],
    margin: '10px 0 16px',
    [theme.breakpoints.down('sm')]: {
      margin: '50px 0 16px',
    },
  },
  travelerProfileBtn: {
    display: 'flex',
    flexDirection: 'column',
    textTransform: 'none',
    width: '170px',
    height: '117px',
    borderRadius: '10px',
    backgroundColor: theme.palette.grey.f7,
    color: theme.palette.grey['4f'],
    '&:hover': {
      color: theme.palette.primary.contrastText,
    },
  },
  travelerProfileBtnActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}))

const iconTypes = ['🚗', '🚆', '🚗']
const iconRanges = ['⏱', '⏳', '⏱']

const FourthStep = () => {
  const history = useHistory()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const { firestore, dictionary, timestampRef } = useContext(FirebaseContext)
  const { user } = useContext(SessionContext)

  const [allTypes, setAllTypes] = useState([])
  const [travelerType, setTravelerType] = useState()
  const [allRanges, setAllRanges] = useState([])
  const [travelerRange, setTravelerRange] = useState()
  const [allLikes, setAllLikes] = useState([])
  const [travelerLikes, setTravelerLikes] = useState({})

  useEffect(() => {
    if (dictionary.meta_voyageur_type) {
      const arrayOfTypes = Object.entries(dictionary.meta_voyageur_type)
      const tempTypes = arrayOfTypes.map(type => ({
        value: type[0],
        label: type[1].name,
      }))
      setTravelerType(tempTypes[0].value)
      setAllTypes(tempTypes)
    }
    if (dictionary.meta_duree_voyage) {
      const arrayOfDurations = Object.entries(dictionary.meta_duree_voyage)
      const tempDurations = arrayOfDurations.map(duration => ({
        value: duration[0],
        label: duration[1].name,
      }))
      setTravelerRange(tempDurations[0].value)
      setAllRanges(tempDurations)
    }
    if (dictionary.meta_name_envies_sport) {
      const shuffledLikes = arrayShuffle(dictionary.meta_name_envies_sport)
      setAllLikes(shuffledLikes)

      const tempTravelerLikes = {}
      shuffledLikes.forEach(option => {
        tempTravelerLikes[option.value] = false
      })
      setTravelerLikes(tempTravelerLikes)
    }
  }, [dictionary])

  const onSubmit = async () => {
    const filteredLikes = filterObjectByValue(travelerLikes, true)
    const tempLikes = Object.keys(filteredLikes)
    await firestore
      .collection('users')
      .doc(user.id)
      .set(
        {
          type: travelerType,
          rangeType: travelerRange,
          likes: tempLikes,
          updatedAt: new timestampRef.fromDate(new Date()),
        },
        { merge: true }
      )
    history.push('/signup/fifthStep')
  }

  return (
    <Wrapper
      currentStep="3"
      title="Super ! Ton compte a bien été créé"
      subtitle="Maintenant, aide nous à mieux te connaitre pour que l’on puisse te proposer des contenus adaptés à tes goûts et tes envies."
      backURL="/signup/thirdStep"
      handleSubmit={onSubmit}
    >
      <Box>
        <Typography className={classes.travelerProfileTitle}>Tu es un voyageur :</Typography>
        <Box
          sx={{
            overflowX: 'scroll',
            margin: '0 -32px',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Box className={classes.travelPflBtnContainer}>
            {allTypes.map((currentType, typeIndex) => (
              <Button
                key={currentType.value}
                variant="contained"
                disableElevation
                className={clsx(classes.travelerProfileBtn, {
                  [classes.travelerProfileBtnActive]: travelerType === currentType.value,
                })}
                onClick={() => setTravelerType(currentType.value)}
              >
                <Typography sx={{ fontSize: '38px' }}>{iconTypes[typeIndex]}</Typography>
                <Typography sx={{ marginTop: '10px', fontSize: '17px' }}>
                  {currentType.label}
                </Typography>
              </Button>
            ))}
          </Box>
        </Box>
        <Typography className={classes.travelerProfileTitle}>
          Tu pars généralement pour :
        </Typography>
        <Box
          sx={{
            overflowX: 'scroll',
            margin: '0 -32px',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Box className={classes.travelPflBtnContainer}>
            {allRanges.map((currentRange, rangeIndex) => (
              <Button
                key={currentRange.value}
                variant="contained"
                disableElevation
                className={clsx(classes.travelerProfileBtn, {
                  [classes.travelerProfileBtnActive]: travelerRange === currentRange.value,
                })}
                onClick={() => setTravelerRange(currentRange.value)}
              >
                <Typography sx={{ fontSize: '38px' }}>{iconRanges[rangeIndex]}</Typography>
                <Typography sx={{ marginTop: '10px', fontSize: '17px' }}>
                  {currentRange.label}
                </Typography>
              </Button>
            ))}
          </Box>
        </Box>
        <Typography className={classes.travelerProfileTitle}>En voyage, tu aimes :</Typography>
        <Box
          sx={{
            overflowX: 'scroll',
            margin: '0 -32px',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Box
            component={Carousel}
            partialVisible
            responsive={{
              desktop: {
                breakpoint: {
                  max: 8000,
                  min: 640,
                },
                items: 5,
                partialVisibilityGutter: 15,
              },
              mobile: {
                breakpoint: {
                  max: 640,
                  min: 0,
                },
                items: 2,
                partialVisibilityGutter: 10,
              },
            }}
            slidesToSlide={matchesXs ? 1 : 4}
            removeArrowOnDeviceType="mobile"
          >
            {allLikes.map(currentLike => (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Card
                  key={currentLike.value}
                  elevation={0}
                  sx={{
                    width: 170,
                    borderRadius: '10px',
                    position: 'relative',
                    border: travelerLikes[currentLike.value]
                      ? `4px solid ${theme.palette.primary.main}`
                      : `none`,
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      setTravelerLikes({
                        ...travelerLikes,
                        [currentLike.value]: !travelerLikes[currentLike.value],
                      })
                    }
                  >
                    <CardMedia
                      component="img"
                      height={travelerLikes[currentLike.value] ? '109px' : '117px'}
                      image={currentLike.picture}
                      alt=""
                    />
                    <Box
                      sx={{
                        width: '30px',
                        height: '30px',
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        backgroundColor: travelerLikes[currentLike.value]
                          ? 'primary.main'
                          : 'grey.df',
                        border: `2px solid ${
                          travelerLikes[currentLike.value] ? theme.palette.primary.main : 'white'
                        }`,
                        borderRadius: '5px',
                        color: 'primary.contrastText',
                      }}
                    >
                      {travelerLikes[currentLike.value] && <Check color="inherit" />}
                    </Box>
                  </CardActionArea>
                </Card>
                <Typography
                  sx={{ mt: 2 }}
                  dangerouslySetInnerHTML={{ __html: currentLike.label }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        width="100%"
        alignItems="center"
        flexDirection={matchesXs ? 'column' : 'row'}
        mt={matchesXs ? 6 : 0}
      >
        <Box mr={matchesXs ? 0 : 4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={false}
            type="submit"
            sx={{
              [theme.breakpoints.down('sm')]: {
                borderRadius: '50px',
                fontSize: '22px',
                textTransform: 'unset',
              },
            }}
          >
            Terminer
          </Button>
        </Box>
        <Button
          onClick={() => history.push('/signup/fifthStep')}
          sx={{
            [theme.breakpoints.down('sm')]: {
              borderRadius: '50px',
              fontSize: '14px',
              textTransform: 'unset',
              marginTop: '30px',
            },
          }}
        >
          Ignorer cette étape
        </Button>
      </Box>
    </Wrapper>
  )
}

export default FourthStep

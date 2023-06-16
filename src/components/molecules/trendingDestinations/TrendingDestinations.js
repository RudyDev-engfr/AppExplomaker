import React from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles, useTheme } from '@mui/styles'
import MultiCarousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import CountryTile from './CountryTile'
import TrendingDestinationsDotBox from './TrendingDestinationsDotBox'
import TrendingDestinationsGroupButton from './TrendingDestinationsGroupButton'

const useStyles = makeStyles(theme => ({
  // Responsive Part
  mobileFlexColumn: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  // mobileSubtitle: {
  //   [theme.breakpoints.down('sm')]: {
  //     fontSize: '18px',
  //     fontWeight: '500',
  //     lineHeight: '21px',
  //   },
  // },
  mobileTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
      lineHeight: '30px',
    },
  },
  mobileCarouselItem: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
}))

const TrendingDestinations = ({ trendingDestinationsItems, dotListClass }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box className={classes.mobileFlexColumn}>
      <Box>
        <Box marginBottom="25px">
          <Typography
            variant="h2"
            className={classes.mobileTitle}
            sx={{
              fontSize: '28px',
              fontWeight: '500',
              lineHeight: '32px',
              fontFamily: 'Rubik',
            }}
          >
            Spots populaires{' '}
          </Typography>
        </Box>
      </Box>
      {matchesXs ? (
        <MultiCarousel
          itemClass={classes.mobileCarouselItem}
          autoPlaySpeed={3000}
          draggable
          arrows={false}
          focusOnSelect={false}
          infinite
          showDots={false}
          renderDotsOutside
          keyBoardControl
          partialVisbile
          minimumTouchDrag={80}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 640,
              },
              items: 1,
            },
            mobile: {
              breakpoint: {
                max: 640,
                min: 0,
              },
              items: 1,
              partialVisibilityGutter: 20,
            },
          }}
          slidesToSlide={1}
          swipeable
          ssr
          deviceType="mobile"
        >
          {trendingDestinationsItems
            .filter(({ photo_titree: photoTitree, titre }) => photoTitree !== '' && titre !== '')
            .map(({ continent, photo_titree: photoTitree, titre, link, color }) => (
              <CountryTile
                countryTitle={titre}
                category={continent}
                srcImg={photoTitree}
                altImg=""
                key={`trendingDestination-${link}`}
                categoryColor={color}
              />
            ))}
        </MultiCarousel>
      ) : (
        <Box position="relative">
          <MultiCarousel
            autoPlaySpeed={3000}
            centerMode
            draggable
            arrows={false}
            focusOnSelect={false}
            infinite
            renderButtonGroupOutside
            customButtonGroup={<TrendingDestinationsGroupButton />}
            showDots
            dotListClass={dotListClass}
            customDot={<TrendingDestinationsDotBox carouselArray={trendingDestinationsItems} />}
            renderDotsOutside
            keyBoardControl
            minimumTouchDrag={80}
            partialVisible={false}
            responsive={{
              desktop: {
                breakpoint: {
                  max: 3000,
                  min: 640,
                },
                items: 3,
                partialVisibilityGutter: 40,
              },
              mobile: {
                breakpoint: {
                  max: 640,
                  min: 0,
                },
                items: 1,
                partialVisibilityGutter: 30,
              },
            }}
            slidesToSlide={1}
            swipeable
            ssr
            deviceType="desktop"
          >
            {trendingDestinationsItems
              .filter(({ photo_titree: photoTitree, titre }) => photoTitree !== '' && titre !== '')
              .map(({ continent, photo_titree: photoTitree, titre, color }) => (
                <CountryTile
                  countryTitle={titre}
                  category={continent}
                  categoryColor={color}
                  srcImg={photoTitree}
                  altImg=""
                  key={`trendingDestination-${titre}`}
                  link={titre.toLowerCase()}
                />
              ))}
          </MultiCarousel>
        </Box>
      )}
    </Box>
  )
}

export default TrendingDestinations

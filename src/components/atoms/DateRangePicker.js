import React from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { useTheme } from '@mui/material'
import { DateRangePicker } from '@mantine/dates'

const useStyles = makeStyles(theme => ({
  unstyledVariant: {
    border: `1px solid ${theme.palette.grey.bd}`,
    borderRadius: '10px',
    height: 'unset!important',
    padding: '15px 25px',
    fontSize: '17px',
    '&:focus, &:active, &:hover': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      padding: '15px ',
    },
  },
}))

const CustomDateRangePicker = ({ value, setter }) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <DateRangePicker
      variant="unstyled"
      placeholder="Départ - Retour"
      clearable={false}
      locale="fr"
      minDate={new Date()}
      value={value}
      withinPortal={false}
      onChange={event => {
        if (event[0] && event[1]) {
          setter([event[0], event[1]])
        } else {
          setter(['', ''])
        }
      }}
      styles={() => ({
        selected: {
          backgroundColor: `${theme.palette.primary.main}!important`,
          borderRadius: '100px !important',
          position: 'relative',
          color: 'white!important',
        },
        firstInRange: {
          borderRadius: '50% 0 0 50% !important',
          color: 'white!important',
          backgroundColor: `${theme.palette.primary.ultraLight}!important`,
          zIndex: '1',
          '&::after': {
            content: '""',
            borderRadius: '100px !important',
            backgroundColor: theme.palette.primary.main,
            position: 'absolute',
            width: '100%',
            height: '100%',
            right: '0',
            zIndex: '-1',
          },
        },
        lastInRange: {
          borderRadius: '0 50% 50% 0 !important',
          backgroundColor: `${theme.palette.primary.ultraLight}!important`,
          zIndex: '1',
          '&::after': {
            content: '""',
            borderRadius: '100px !important',
            backgroundColor: theme.palette.primary.main,
            position: 'absolute',
            width: '100%',
            height: '100%',
            right: '0',
            zIndex: '-1',
          },
        },
        inRange: {
          backgroundColor: `${theme.palette.primary.ultraLight}!important`,
        },
      })}
      classNames={{
        unstyledVariant: classes.unstyledVariant,
        day: classes.day,
      }}
    />
  )
}

export default CustomDateRangePicker

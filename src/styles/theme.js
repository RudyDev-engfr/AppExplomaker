import { createTheme } from '@mui/material/styles'

const titleFontFamily = 'Vesper Libre'
const fontFamily = 'Rubik'

const commonSettings = createTheme({
  palette: {
    primary: {
      ultraLight: '#E6F5F4',
      light: '#33b0a3',
      main: '#009d8c',
      dark: '#008481',
      ultraDark: '#006A75',
      lightGreenBackground: '#E8F1F2',
      vertPerse: '#F4FBFA',
    },
    secondary: {
      ultraLight: '#F4E6E6',
      light: '#ba6b6e',
      main: '#A9474A',
      dark: '#763133',
      constrastText: 'white',
      likes: '#D73535',
    },
    vertclair: {
      light: '#E8F1F2',
      main: '#F5F9F9',
    },
    grey: {
      black: '#000000',
      f7: '#F7F7F7',
      df: '#DFDFDF',
      82: '#828282',
      f2: '#f2f2f2',
      33: '#333333',
      bd: '#BDBDBD',
      '4f': '#4F4F4F',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: '#828282',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily,
    h1: {
      fontFamily: titleFontFamily,
      fontSize: '2.375rem',
      fontWeight: 500,
      color: '#000000',
    },
    h2: {
      fontFamily: titleFontFamily,
    },
    h3: {
      fontFamily: titleFontFamily,
    },
    h4: {
      fontFamily: titleFontFamily,
    },
    h5: {
      fontFamily,
      fontWeight: 700,
      fontSize: '24px',
      lineHeight: '28px',
    },
    h6: {
      fontFamily,
    },
    subtitle1: {
      fontFamily,
    },
    subtitle2: {
      fontFamily,
    },
    body1: {
      fontFamily,
    },
    body2: {
      fontFamily,
    },
    button: {
      fontFamily,
    },
    caption: {
      fontFamily,
    },
    overline: {
      fontFamily,
    },
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(220,220,220,0.2),0px 2px 1px 0px rgba(220,220,220,0.14),0px 2px 1px 0px rgba(220,220,220,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
  breakpoints: {
    values: {
      xs: 600,
      sm: 960,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 20,
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'white!important',
          width: '100%',
          border: '2px solid #DFDFDF',
          borderRadius: '5px',
          transition: 'all .2s',
          '&:hover': {
            border: '2px solid #009d8c',
            backgroundColor: 'white!important',
          },
          '&.Mui-focused': { border: '2px solid #009d8c' },
          '@media (max-width: 600px)': {
            height: '82px',
            fontSize: '22px',
            fontWeight: '400',
            fontFamily: 'Rubik',
            borderRadius: '10px',
          },
        },
        underline: {
          '&::before': {
            content: 'none',
          },
          '&::after': {
            content: 'none',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          paddingTop: '0!important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#009d8c',
          color: 'white',
        },
      },
    },
  },
})

export default commonSettings

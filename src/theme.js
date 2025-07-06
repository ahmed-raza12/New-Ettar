import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1C1C1C',
      light: '#8a6d4b',
    },
    secondary: {
      main: '#C8A04D',
    },
    accent: {
      main: '#d4a373',
    },
    text: {
      primary: '#333333',
      secondary: '#777777',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '12px 24px',
          fontWeight: 500,
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
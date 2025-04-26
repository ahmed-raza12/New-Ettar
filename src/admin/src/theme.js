// admin/src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#E8D7C3',
    },
    secondary: {
      main: '#D4BFA1',
    },
    accent: {
      main: '#A68A64',
    },
    dark: {
      main: '#3A3A3A',
    },
    light: {
      main: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});
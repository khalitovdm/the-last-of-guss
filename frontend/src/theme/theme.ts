import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2e7d32', // A deeper, matrix-like green
    },
    secondary: {
      main: '#fbc02d', // A more muted gold/yellow
    },
    background: {
      default: '#000000',
      paper: 'rgba(0, 20, 0, 0.75)',
    },
    text: {
      primary: '#4caf50', // Brighter text for contrast
      secondary: '#388e3c',
    },
  },
  typography: {
    fontFamily: '"Press Start 2P", monospace',
    allVariants: {
      color: '#4caf50',
    },
    h1: {
      fontSize: '2.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1rem',
    },
    h5: {
      fontSize: '1.5rem',
      textTransform: 'uppercase',
    },
    body1: {
      fontSize: '1rem',
    },
    caption: {
      fontSize: '0.85rem',
      letterSpacing: '0.05rem',
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(76, 175, 80, 0.5)',
            },
            '&:hover fieldset': {
              borderColor: '#4caf50',
            },
          },
        },
      },
    },
     MuiButton: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(76, 175, 80, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderColor: '#4caf50',
          },
        },
      },
    },
  },
});

export default theme; 
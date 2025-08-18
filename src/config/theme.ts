import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {//主要な色
      main: '#11c38dff',
    },
    secondary: {//補助的な色
      main: '#dc004e',
    },
  error: {
      main: red[500],
    },
    //背景色
    background: {
      default: '#f4f6f8', //背景色
      paper: '#ffffff', //コンポーネントの背景色
    },
  },
  typography: {
    fontFamily: [
      'system-ui',
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 700,
      fontSize: '1.2rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
    },
  },
});

export default theme;
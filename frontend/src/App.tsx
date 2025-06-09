import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import theme from '@/theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App; 
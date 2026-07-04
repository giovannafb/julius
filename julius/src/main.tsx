import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './auth/AuthContext';
import App from './App';

// Tema com fundo mais cinza claro para o formulário se destacar com o boxShadow branco
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f0f2f5', 
      paper: '#ffffff',   
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
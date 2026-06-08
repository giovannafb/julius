import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Usuario from './Usuario'; // Seu componente de formulário

// Criando um tema explicitamente claro
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff', // Garante que o fundo padrão seja branco
      paper: '#f5f5f5',   // Cor para superfícies como Cards
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* O ThemeProvider injeta as configurações em toda a aplicação */}
    <ThemeProvider theme={lightTheme}>
      {/* O CssBaseline aplica o fundo branco no <body> do HTML */}
      <CssBaseline />
      <Usuario />
    </ThemeProvider>
  </StrictMode>,
);
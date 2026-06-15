import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Usuario from './Usuario';
import ObjetivoFinanceiro from './ObjetivoFinanceiro';
import Receita from './Receita';
import Despesa from './Despesa';
import PlanoFinanceiro from './PlanoFinanceiro';

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

function App() {
  return (
    <BrowserRouter>
      {/* Menu de Navegação Superior */}
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button color="inherit" component={Link} to="/">Usuário</Button>
          <Button color="inherit" component={Link} to="/plano">Plano Financeiro</Button>
          <Button color="inherit" component={Link} to="/objetivo">Objetivo</Button>
          <Button color="inherit" component={Link} to="/receita">Receita</Button>
          <Button color="inherit" component={Link} to="/despesa">Despesa</Button>
        </Toolbar>
      </AppBar>

      {/* Conteúdo Principal (Rotas) */}
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<Usuario />} />
          <Route path="/plano" element={<PlanoFinanceiro />} />
          <Route path="/objetivo" element={<ObjetivoFinanceiro />} />
          <Route path="/receita" element={<Receita />} />
          <Route path="/despesa" element={<Despesa />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from './auth/AuthContext';

import UsuarioList from './pages/UsuarioList';
import Usuario from './pages/Usuario'; // This is the Form
import UsuarioPerfil from './pages/UsuarioPerfil';
import ObjetivoFinanceiro from './pages/ObjetivoFinanceiro';
import Receita from './pages/Receita';
import Despesa from './pages/Despesa';
import PlanoFinanceiro from './pages/PlanoFinanceiro';
import Login from './pages/Login';
import PrivateRoute from './routes/PrivateRoute';

function Navigation() {
  const { token, usuarioId, logout } = useAuth();
  
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button color="inherit" component={Link} to="/plano">Plano Financeiro</Button>
        <Button color="inherit" component={Link} to="/objetivo">Objetivo</Button>
        <Button color="inherit" component={Link} to="/receita">Receita</Button>
        <Button color="inherit" component={Link} to="/despesa">Despesa</Button>
        
        {token ? (
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" component={Link} to="/usuario/perfil">
              <AccountCircleIcon />
            </IconButton>
            <Button color="inherit" onClick={logout}>Sair</Button>
          </Box>
        ) : (
          <Button color="inherit" component={Link} to="/login" sx={{ ml: 'auto' }}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/usuario/novo" element={<Usuario />} />
          
          <Route path="/" element={<Navigate to="/plano" replace />} />
          <Route path="/usuario/perfil" element={<PrivateRoute><UsuarioPerfil /></PrivateRoute>} />
          <Route path="/usuario/editar/:id" element={<PrivateRoute><Usuario /></PrivateRoute>} />
          
          <Route path="/plano" element={<PrivateRoute><PlanoFinanceiro /></PrivateRoute>} />
          <Route path="/objetivo" element={<PrivateRoute><ObjetivoFinanceiro /></PrivateRoute>} />
          <Route path="/receita" element={<PrivateRoute><Receita /></PrivateRoute>} />
          <Route path="/despesa" element={<PrivateRoute><Despesa /></PrivateRoute>} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from './auth/AuthContext';
import { useState, useEffect } from 'react';
import axios from './api/axios';

import UsuarioList from './pages/UsuarioList';
import Usuario from './pages/Usuario'; // This is the Form
import UsuarioPerfil from './pages/UsuarioPerfil';
import ObjetivoFinanceiro from './pages/ObjetivoFinanceiro';
import Receita from './pages/Receita';
import Despesa from './pages/Despesa';
import Home from './pages/Home';
import RelatorioMensal from './pages/RelatorioMensal';
import Notificacao from './pages/Notificacao';
import AnaliseImpacto from './pages/AnaliseImpacto';
import Login from './pages/Login';
import PrivateRoute from './routes/PrivateRoute';

function Navigation() {
  const { token, usuarioId, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (token && usuarioId) {
      const fetchNotifications = async () => {
        try {
          const res = await axios.get('/notificacoes');
          const myNotifs = res.data.filter((n: any) => 
            n.analiseImpacto?.planoFinanceiro?.usuarioId === Number(usuarioId)
          );
          const unread = myNotifs.filter((n: any) => !n.lida).length;
          setUnreadCount(unread);
        } catch (error) {
          console.error("Erro ao carregar notificações", error);
        }
      };
      fetchNotifications();
      // Polling básico a cada 30 segundos
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [token, usuarioId]);

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', px: { xs: 2, md: 4 } }}>
        <Button color="inherit" component={Link} to="/home" sx={{ display: 'flex', alignItems: 'center', gap: 1, textTransform: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <img src="/logo.png" alt="Julius Logo" style={{ height: '36px' }} />
          Julius
        </Button>
        
        {token ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" component={Link} to="/notificacoes" title="Notificações">
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" component={Link} to="/usuario/perfil" title="Perfil do Usuário">
              <AccountCircleIcon />
            </IconButton>
            <IconButton color="inherit" onClick={logout} title="Sair">
              <LogoutIcon />
            </IconButton>
          </Box>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
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
          
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/usuario/perfil" element={<PrivateRoute><UsuarioPerfil /></PrivateRoute>} />
          <Route path="/usuario/editar/:id" element={<PrivateRoute><Usuario /></PrivateRoute>} />
          
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/relatorios" element={<PrivateRoute><RelatorioMensal /></PrivateRoute>} />
          <Route path="/notificacoes" element={<PrivateRoute><Notificacao /></PrivateRoute>} />
          <Route path="/analises" element={<PrivateRoute><AnaliseImpacto /></PrivateRoute>} />
          <Route path="/objetivo" element={<PrivateRoute><ObjetivoFinanceiro /></PrivateRoute>} />
          <Route path="/receita" element={<PrivateRoute><Receita /></PrivateRoute>} />
          <Route path="/despesa" element={<PrivateRoute><Despesa /></PrivateRoute>} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

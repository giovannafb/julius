import { useState } from 'react';
import {
  Box, Button, TextField, Typography, Snackbar, Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import axios from '../api/axios';

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        login,
        senha,
      });

      const { token, usuarioId } = response.data;
      setToken(token, usuarioId);
      navigate('/plano'); // Vai para o plano financeiro (Dashboard principal)
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleLogin}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center', 
        height: '70vh', 
        px: 2, 
        gap: 2,
        maxWidth: 400,
        margin: '0 auto',
        mt: 8,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }}
    >
      <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
        Login
      </Typography>
      
      <TextField 
        label="Login" 
        value={login}
        onChange={(e) => setLogin(e.target.value)} 
        fullWidth 
        required
        variant="outlined"
      />
      <TextField 
        label="Senha" 
        type="password" 
        value={senha}
        onChange={(e) => setSenha(e.target.value)} 
        fullWidth 
        required
        variant="outlined"
      />
      
      <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2 }}>
        Entrar
      </Button>

      <Button variant="text" onClick={() => navigate('/usuario/novo')} fullWidth>
        Ainda não tem conta? Cadastre-se
      </Button>

      <Snackbar 
        open={!!erro} 
        autoHideDuration={4000} 
        onClose={() => setErro('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>
      </Snackbar>
    </Box>
  );
}
import { useState } from 'react';
import {
  Box, Button, TextField, Typography, Snackbar, Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../auth/AuthContext';
import axios from '../api/axios';

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const mode = theme.palette.mode;

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
      navigate('/home'); // Vai para a Home (Dashboard principal)
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', p: 1 }}>
      
      {/* Logo e Título Fora da Caixa */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <img src="/logo_extraida_cropped.png" alt="Julius Logo" style={{ height: '70px', filter: mode === 'light' ? 'brightness(0) saturate(100%) invert(29%) sepia(51%) saturate(543%) hue-rotate(124deg) brightness(97%) contrast(93%)' : 'brightness(0) invert(1)', marginBottom: '4px' }} />
        <Typography variant="h4" color="primary" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 'bold' }}>
          Julius
        </Typography>
      </Box>

      {/* Caixa do Formulário */}
      <Box 
        component="form" 
        onSubmit={handleLogin}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%',
          maxWidth: 360,
          p: 3,
          gap: 2,
          boxShadow: mode === 'dark' ? '0 4px 40px rgba(0, 230, 118, 0.2)' : '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 4,
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 0 }}>
          Acesse sua conta
        </Typography>
        
        <TextField 
          label="Login" 
          value={login}
          onChange={(e) => setLogin(e.target.value)} 
          fullWidth 
          required
          variant="outlined"
          size="small"
        />
        <TextField 
          label="Senha" 
          type="password" 
          value={senha}
          onChange={(e) => setSenha(e.target.value)} 
          fullWidth 
          required
          variant="outlined"
          size="small"
        />
        
        <Button type="submit" variant="contained" fullWidth size="medium" sx={{ py: 1, fontWeight: 'bold', mt: 1 }}>
          Entrar
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0 }}>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mr: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Novo por aqui?</Typography>
          <Button variant="text" size="small" onClick={() => navigate('/usuario/novo')} sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>
            Cadastre-se
          </Button>
        </Box>
      </Box>

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
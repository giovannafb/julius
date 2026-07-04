import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircularProgress from '@mui/material/CircularProgress';
import { Alert } from '@mui/material';

interface IUsuario {
    id: number;
    nome: string;
    login: string;
    email: string;
    telefone: string;
}

export default function UsuarioPerfil() {
    const { token, usuarioId, setToken } = useAuth();
    const navigate = useNavigate();
    
    const [user, setUser] = useState<IUsuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const carregarUsuario = async () => {
            try {
                let idParaBuscar = usuarioId;

                // Fallback se usuarioId não foi retornado pelo backend (ex: cache)
                if (!idParaBuscar && token) {
                    const tokenParts = token.split('.');
                    if (tokenParts.length === 3) {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        if (payload.id) {
                            idParaBuscar = payload.id;
                            setToken(token, payload.id); // Salva no contexto
                        } else if (payload.login) {
                            // Busca na lista geral caso o token seja antigo e não tenha ID
                            const resAll = await axios.get('/usuarios');
                            const match = resAll.data.find((u: any) => u.login === payload.login);
                            if (match) {
                                idParaBuscar = match.id;
                                setToken(token, match.id); // Salva no contexto
                            }
                        }
                    }
                }

                if (!idParaBuscar) {
                    setErro('ID do usuário não encontrado. Por favor, faça login novamente.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`/usuarios/${idParaBuscar}`);
                setUser(response.data);
            } catch (err) {
                setErro('Erro ao carregar os dados do perfil.');
            } finally {
                setLoading(false);
            }
        };

        carregarUsuario();
    }, [usuarioId, token, setToken]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (erro || !user) {
        return (
            <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
                <Alert severity="error">{erro || 'Usuário não encontrado'}</Alert>
                <Button variant="outlined" sx={{ mt: 2 }} fullWidth onClick={() => navigate('/login')}>
                    Ir para Login
                </Button>
            </Box>
        );
    }

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <AccountCircleIcon color="primary" sx={{ fontSize: 80, mb: 1 }} />
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                    Meu Perfil
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                    <Typography variant="caption" color="text.secondary">Nome</Typography>
                    <Typography variant="body1">{user.nome}</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">Login</Typography>
                    <Typography variant="body1">{user.login}</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{user.email}</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">Telefone</Typography>
                    <Typography variant="body1">{user.telefone}</Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={() => navigate(`/usuario/editar/${usuarioId}`)}
                >
                    Editar Perfil
                </Button>
                <Button 
                    variant="text" 
                    fullWidth 
                    onClick={() => navigate('/plano')}
                >
                    Voltar
                </Button>
            </Box>
        </Box>
    );
}

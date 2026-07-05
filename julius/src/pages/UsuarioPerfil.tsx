import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CircularProgress from '@mui/material/CircularProgress';
import { Alert, Card, CardContent, Divider, Grid, Tabs, Tab, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SettingsIcon from '@mui/icons-material/Settings';

interface IUsuario {
    id: number;
    nome: string;
    login: string;
    email: string;
    telefone: string;
}

interface ITransacao {
    id: number;
    descricao: string;
    valor: number;
    data: string;
    tipo: 'RECEITA' | 'DESPESA';
}

interface IReceitaFixa {
    fonte: string;
    transacao: ITransacao;
}

interface IDespesaFixa {
    transacao: ITransacao;
}

interface IPerfilEconomico {
    id: number;
    saldo: number;
    status: boolean;
    receitasFixas: IReceitaFixa[];
    despesasFixas: IDespesaFixa[];
    historico?: {
        transacoes: ITransacao[];
    };
}

export default function UsuarioPerfil() {
    const { token, usuarioId, setToken } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState<IUsuario | null>(null);
    const [perfil, setPerfil] = useState<IPerfilEconomico | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [tabValue, setTabValue] = useState(0);

    const [selectedTransacao, setSelectedTransacao] = useState<ITransacao | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (t: ITransacao) => {
        setSelectedTransacao(t);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedTransacao(null);
    };

    useEffect(() => {
        const carregarDados = async () => {
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

                const [responseUser, responsePerfil] = await Promise.all([
                    axios.get(`/usuarios/${idParaBuscar}`),
                    axios.get(`/perfisEconomicos/usuario/${idParaBuscar}`).catch(() => null)
                ]);

                setUser(responseUser.data);
                if (responsePerfil && responsePerfil.data) {
                    setPerfil(responsePerfil.data);
                }
            } catch (err) {
                setErro('Erro ao carregar os dados do perfil.');
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <Box sx={{ flexGrow: 1, p: 1, width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', gap: 4, flexGrow: 1, minHeight: 0, width: '100%' }}>
                {/* Lado Esquerdo: Receitas/Despesas e Histórico (Proporção 12) */}
                <Box sx={{ flex: 12, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', minWidth: 0 }}>
                    {!perfil ? (
                        <Alert severity="info">O Perfil Econômico não foi encontrado.</Alert>
                    ) : (
                        <>
                            {/* Receitas e Despesas Fixas (Metade de cima) */}
                            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', flex: 1, borderRadius: 2, boxShadow: 1, minHeight: 0 }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                                        <Tab label="Despesas Fixas" sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
                                        <Tab label="Receitas Fixas" sx={{ fontWeight: 'bold', fontSize: '1rem' }} />
                                    </Tabs>
                                </Box>
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, bgcolor: 'background.paper', minHeight: 0 }}>
                                    <Box sx={{
                                        flexGrow: 1,
                                        overflowY: 'auto',
                                        p: 1.5,
                                        bgcolor: 'grey.50',
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'grey.200',
                                    }}>
                                        {tabValue === 0 ? (
                                            /* Despesas Fixas */
                                            perfil.despesasFixas?.length > 0 ? (
                                                perfil.despesasFixas.map((d, index) => (
                                                    <Box
                                                        key={index}
                                                        onClick={() => handleOpenDialog(d.transacao)}
                                                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, p: 1.5, bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                                                    >
                                                        <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                                                            <Typography variant="body1" fontWeight="bold" noWrap>{d.transacao.descricao}</Typography>
                                                        </Box>
                                                        <Typography variant="body1" color="error.main" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
                                                            - {formatCurrency(d.transacao.valor)}
                                                        </Typography>
                                                    </Box>
                                                ))
                                            ) : (
                                                <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>Nenhuma despesa fixa.</Typography>
                                            )
                                        ) : (
                                            /* Receitas Fixas */
                                            perfil.receitasFixas?.length > 0 ? (
                                                perfil.receitasFixas.map((r, index) => (
                                                    <Box
                                                        key={index}
                                                        onClick={() => handleOpenDialog(r.transacao)}
                                                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, p: 1.5, bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                                                    >
                                                        <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
                                                            <Typography variant="body1" fontWeight="bold" noWrap>{r.transacao.descricao}</Typography>
                                                        </Box>
                                                        <Typography variant="body1" color="success.main" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
                                                            {formatCurrency(r.transacao.valor)}
                                                        </Typography>
                                                    </Box>
                                                ))
                                            ) : (
                                                <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>Nenhuma receita fixa.</Typography>
                                            )
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Histórico de Transações (Metade de baixo) */}
                            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', flex: 1, borderRadius: 2, boxShadow: 1, minHeight: 0 }}>
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, bgcolor: 'background.paper', minHeight: 0 }}>
                                    <Typography variant="h6" align="center" fontWeight="bold" color="text.primary" sx={{ mb: 2, flexShrink: 0 }}>
                                        Histórico
                                    </Typography>
                                    <Box sx={{
                                        flexGrow: 1,
                                        overflowY: 'auto',
                                        p: 1.5,
                                        bgcolor: 'grey.50',
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'grey.200',
                                    }}>
                                        {perfil.historico?.transacoes && perfil.historico.transacoes.length > 0 ? (
                                            perfil.historico.transacoes.map((t) => (
                                                <Box
                                                    key={t.id}
                                                    onClick={() => handleOpenDialog(t)}
                                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, p: 1.5, bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: 6, borderColor: t.tipo === 'RECEITA' ? 'success.main' : 'error.main', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                                                >
                                                    <Box sx={{ flex: 1, minWidth: 0, mr: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Box sx={{
                                                            bgcolor: t.tipo === 'RECEITA' ? 'success.light' : 'error.light',
                                                            borderRadius: '50%',
                                                            p: 0.5,
                                                            display: 'flex',
                                                            flexShrink: 0
                                                        }}>
                                                            {t.tipo === 'RECEITA' ? <ArrowUpwardIcon fontSize="small" sx={{ color: 'success.dark' }} /> : <ArrowDownwardIcon fontSize="small" sx={{ color: 'error.dark' }} />}
                                                        </Box>
                                                        <Typography variant="body1" fontWeight="bold" noWrap>{t.descricao}</Typography>
                                                    </Box>
                                                    <Typography variant="body1" fontWeight="bold" color={t.tipo === 'RECEITA' ? 'success.main' : 'error.main'} sx={{ whiteSpace: 'nowrap' }}>
                                                        {t.tipo === 'RECEITA' ? '+' : '-'} {formatCurrency(t.valor)}
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>Nenhuma transação no último mês.</Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </Box>

                {/* Lado Direito: Perfil do Usuário e Saldo (Proporção 8) */}
                <Box sx={{ flex: 8, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', minWidth: 0 }}>

                    {/* Perfil do Usuário */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            p: 2,
                            boxShadow: 2,
                            borderRadius: 2,
                            backgroundColor: 'background.paper',
                            position: 'relative',
                            flex: 1,
                            justifyContent: 'center',
                            minHeight: 0
                        }}
                    >
                        <IconButton
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                            color="primary"
                            onClick={() => navigate(`/usuario/editar/${usuarioId}`)}
                            title="Editar Perfil"
                        >
                            <SettingsIcon />
                        </IconButton>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                            <AccountCircleIcon color="primary" sx={{ fontSize: 50 }} />
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                Perfil do Usuário
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 1, overflowY: 'auto' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium">Nome</Typography>
                                <Typography variant="body1" fontWeight="bold" noWrap>{user.nome}</Typography>
                                <Divider sx={{ mt: 0.5 }} />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium">Login</Typography>
                                <Typography variant="body1" fontWeight="bold" noWrap>{user.login}</Typography>
                                <Divider sx={{ mt: 0.5 }} />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium">Email</Typography>
                                <Typography variant="body1" fontWeight="bold" noWrap>{user.email}</Typography>
                                <Divider sx={{ mt: 0.5 }} />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight="medium">Telefone</Typography>
                                <Typography variant="body1" fontWeight="bold" noWrap>{user.telefone}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                            <Button variant="text" size="small" onClick={() => navigate('/plano')}>
                                Voltar
                            </Button>
                        </Box>
                    </Box>

                    {/* Saldo e Status */}
                    {perfil && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 3,
                                boxShadow: 2,
                                borderRadius: 2,
                                backgroundColor: 'background.paper',
                                flexShrink: 0
                            }}
                        >
                            <Box>
                                <Typography variant="h6" color="text.secondary" fontWeight="bold" gutterBottom>Saldo Atual</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                    {formatCurrency(perfil.saldo)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" color="text.secondary" fontWeight="bold">Status</Typography>
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        bgcolor: perfil.saldo >= 0 ? 'success.main' : 'error.main',
                                        boxShadow: 1
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Modal de Detalhes da Transação */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                    Detalhes da Transação
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {selectedTransacao && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Descrição</Typography>
                                <Typography variant="body1" fontWeight="bold">{selectedTransacao.descricao}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Valor</Typography>
                                <Typography variant="h6" color={selectedTransacao.tipo === 'RECEITA' ? 'success.main' : 'error.main'} fontWeight="bold">
                                    {formatCurrency(selectedTransacao.valor)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Data</Typography>
                                <Typography variant="body1">{formatDate(selectedTransacao.data)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Tipo</Typography>
                                <Typography variant="body1">{selectedTransacao.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={handleCloseDialog} variant="contained" color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

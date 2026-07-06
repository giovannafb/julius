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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterListIcon from '@mui/icons-material/FilterList';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schemaUpdate = yup.object({
    nome: yup.string().required("Nome é obrigatório"),
    login: yup.string().required("Login é obrigatório"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    telefone: yup.string().length(11, "Telefone deve ter 11 dígitos").required("Telefone é obrigatório")
}).required();

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
    const { token, usuarioId, setToken, logout } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState<IUsuario | null>(null);
    const [perfil, setPerfil] = useState<IPerfilEconomico | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [tabValue, setTabValue] = useState(0);

    const [selectedTransacao, setSelectedTransacao] = useState<ITransacao | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [senhaAntiga, setSenhaAntiga] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
    const [dialogErro, setDialogErro] = useState('');

    // Filtros do Histórico
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [filterTipo, setFilterTipo] = useState<string>('');
    const [filterPeriodicidade, setFilterPeriodicidade] = useState<string>('');
    const [filterDataInicio, setFilterDataInicio] = useState<string>('');
    const [filterDataFim, setFilterDataFim] = useState<string>('');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Modal de edição de usuário
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schemaUpdate) as any
    });

    const handleOpenEdit = () => {
        if (user) {
            reset({
                nome: user.nome,
                login: user.login,
                email: user.email,
                telefone: user.telefone
            });
            setEditDialogOpen(true);
        }
    };

    const fetchDados = async () => {
        if (!usuarioId) return;
        try {
            const [responseUser, responsePerfil] = await Promise.all([
                axios.get(`/usuarios/${usuarioId}`),
                axios.get(`/perfisEconomicos/usuario/${usuarioId}`).catch(() => null)
            ]);
            setUser(responseUser.data);
            if (responsePerfil && responsePerfil.data) {
                setPerfil(responsePerfil.data);
            }
        } catch (err) {
            console.error("Erro ao recarregar dados", err);
        }
    };

    const handleClearHistory = async () => {
        if (!perfil?.historico?.transacoes?.length) return;
        if (!window.confirm("Deseja realmente apagar todo o histórico?")) return;
        try {
            await Promise.all(perfil.historico.transacoes.map(t => axios.delete(`/transacoes/${t.id}`)));
            fetchDados();
        } catch (e) {
            alert("Erro ao limpar histórico");
        }
    };

    const handleDeleteTransacao = async () => {
        if (!selectedTransacao) return;
        if (!window.confirm("Deseja apagar esta transação?")) return;
        try {
            await axios.delete(`/transacoes/${selectedTransacao.id}`);
            handleCloseDialog();
            fetchDados();
        } catch (e) {
            alert("Erro ao excluir transação");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`/usuarios/${user?.id}`);
            logout();
            navigate('/login');
        } catch (err: any) {
            setErro(err.response?.data?.message || 'Erro ao apagar a conta.');
            setOpenDeleteDialog(false);
        }
    };

    const handleAlterarSenha = async () => {
        setDialogErro('');
        if (novaSenha !== confirmarNovaSenha) {
            setDialogErro('A nova senha e a confirmação não coincidem.');
            return;
        }
        if (novaSenha.length < 6) {
            setDialogErro('A nova senha deve ter no mínimo 6 caracteres.');
            return;
        }
        
        try {
            if (!user?.login) {
                setDialogErro('Login não encontrado.');
                return;
            }

            try {
                await axios.post('/auth/login', { login: user.login, senha: senhaAntiga });
            } catch (err: any) {
                setDialogErro('Senha antiga incorreta.');
                return;
            }

            const payload = {
                nome: user.nome,
                login: user.login,
                email: user.email,
                telefone: user.telefone,
                senha: novaSenha
            };

            await axios.put(`/usuarios/${user.id}`, payload);
            
            alert('Senha alterada com sucesso!');
            setOpenPasswordDialog(false);
            setSenhaAntiga('');
            setNovaSenha('');
            setConfirmarNovaSenha('');
        } catch (err: any) {
            setDialogErro('Erro ao alterar a senha.');
        }
    };

    const onEditSubmit = async (data: any) => {
        try {
            await axios.put(`/usuarios/${user?.id}`, data);
            setUser({ ...user, ...data } as IUsuario);
            setEditDialogOpen(false);
        } catch (err: any) {
            setErro(err.response?.data?.message || 'Erro ao atualizar usuário');
        }
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

    // Arrays filtrados
    const receitasPeriodicas = perfil?.receitasFixas?.filter(r => r.transacao.periodicidade !== 'UNICA') || [];
    const despesasPeriodicas = perfil?.despesasFixas?.filter(d => d.transacao.periodicidade !== 'UNICA') || [];

    const getFilteredHistorico = () => {
        if (!perfil?.historico?.transacoes) return [];
        return perfil.historico.transacoes.filter(t => {
            if (filterTipo && t.tipo !== filterTipo) return false;
            if (filterPeriodicidade && t.periodicidade !== filterPeriodicidade) return false;
            if (filterDataInicio || filterDataFim) {
                const tDate = new Date(t.data).toISOString().split('T')[0];
                if (filterDataInicio && tDate < filterDataInicio) return false;
                if (filterDataFim && tDate > filterDataFim) return false;
            }
            return true;
        });
    };
    const historicoFiltrado = getFilteredHistorico();

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', gap: 6, flexGrow: 1, minHeight: 0, width: '100%' }}>
                {/* Lado Esquerdo: Receitas/Despesas e Histórico (Proporção 65) */}
                <Box sx={{ flex: 65, display: 'flex', flexDirection: 'column', gap: 4, height: '100%', minWidth: 0 }}>
                    {!perfil ? (
                        <Alert severity="info" sx={{ borderRadius: 3 }}>O Perfil Econômico não foi encontrado.</Alert>
                    ) : (
                        <>
                            {/* Receitas e Despesas Fixas (Metade de cima) */}
                            <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1, borderRadius: 4, minHeight: 0, border: 'none' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, bgcolor: 'transparent' }}>
                                    <Box sx={{ display: 'flex', bgcolor: 'rgba(0,0,0,0.04)', borderRadius: 8, p: 0.5 }}>
                                        <Button
                                            disableElevation
                                            variant={tabValue === 0 ? "contained" : "text"}
                                            onClick={() => setTabValue(0)}
                                            sx={{ borderRadius: 8, px: 3, py: 1, textTransform: 'none', fontWeight: 'bold', color: tabValue === 0 ? 'white' : 'text.secondary', bgcolor: tabValue === 0 ? '#aa3bff' : 'transparent', '&:hover': { bgcolor: tabValue === 0 ? '#8a2be2' : 'rgba(0,0,0,0.04)' } }}
                                        >
                                            Despesas Fixas
                                        </Button>
                                        <Button
                                            disableElevation
                                            variant={tabValue === 1 ? "contained" : "text"}
                                            onClick={() => setTabValue(1)}
                                            sx={{ borderRadius: 8, px: 3, py: 1, textTransform: 'none', fontWeight: 'bold', color: tabValue === 1 ? 'white' : 'text.secondary', bgcolor: tabValue === 1 ? '#aa3bff' : 'transparent', '&:hover': { bgcolor: tabValue === 1 ? '#8a2be2' : 'rgba(0,0,0,0.04)' } }}
                                        >
                                            Receitas Fixas
                                        </Button>
                                    </Box>
                                </Box>
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3, pt: 0, bgcolor: 'transparent', minHeight: 0 }}>
                                    <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {tabValue === 0 ? (
                                            /* Despesas Fixas */
                                            despesasPeriodicas.length > 0 ? (
                                                despesasPeriodicas.map((d, index) => (
                                                    <Box
                                                        key={index}
                                                        onClick={() => handleOpenDialog(d.transacao)}
                                                        sx={{
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2,
                                                            bgcolor: 'background.paper', borderRadius: 3, border: '1px solid #eee',
                                                            cursor: 'pointer',
                                                            transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.01)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
                                                        }}
                                                    >
                                                        <Box sx={{ flex: 1, minWidth: 0, mr: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Box sx={{ display: 'flex', flexShrink: 0 }}>
                                                                <TrendingDownIcon sx={{ color: 'error.main' }} />
                                                            </Box>
                                                            <Typography variant="body1" fontWeight="bold" color="text.primary" noWrap>{d.transacao.descricao}</Typography>
                                                        </Box>
                                                        <Typography variant="h6" color="error.main" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
                                                            - {formatCurrency(d.transacao.valor)}
                                                        </Typography>
                                                    </Box>
                                                ))
                                            ) : (
                                                <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>Nenhuma despesa fixa.</Typography>
                                            )
                                        ) : (
                                            /* Receitas Fixas */
                                            receitasPeriodicas.length > 0 ? (
                                                receitasPeriodicas.map((r, index) => (
                                                    <Box
                                                        key={index}
                                                        onClick={() => handleOpenDialog(r.transacao)}
                                                        sx={{
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2,
                                                            bgcolor: 'background.paper', borderRadius: 3, border: '1px solid #eee',
                                                            cursor: 'pointer',
                                                            transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'scale(1.01)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
                                                        }}
                                                    >
                                                        <Box sx={{ flex: 1, minWidth: 0, mr: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Box sx={{ display: 'flex', flexShrink: 0 }}>
                                                                <TrendingUpIcon sx={{ color: 'success.main' }} />
                                                            </Box>
                                                            <Typography variant="body1" fontWeight="bold" color="text.primary" noWrap>{r.transacao.descricao}</Typography>
                                                        </Box>
                                                        <Typography variant="h6" color="success.main" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
                                                            + {formatCurrency(r.transacao.valor)}
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
                            <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1, borderRadius: 4, minHeight: 0, border: 'none' }}>
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3, minHeight: 0 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                                            Histórico Recente
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => setFilterDialogOpen(true)}
                                                sx={{ color: '#00e676', bgcolor: 'rgba(170,59,255,0.05)', '&:hover': { bgcolor: 'rgba(170,59,255,0.1)' } }}
                                                title="Filtros"
                                            >
                                                <FilterListIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={handleClearHistory}
                                                sx={{ color: 'error.main', bgcolor: 'rgba(244,67,54,0.05)', '&:hover': { bgcolor: 'rgba(244,67,54,0.1)' } }}
                                                title="Apagar Histórico"
                                            >
                                                <CleaningServicesIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {historicoFiltrado.length > 0 ? (
                                            historicoFiltrado.map((t) => (
                                                <Box
                                                    key={t.id}
                                                    onClick={() => handleOpenDialog(t)}
                                                    sx={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2,
                                                        bgcolor: 'background.paper', borderRadius: 3, border: '1px solid #eee',
                                                        cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.01)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
                                                    }}
                                                >
                                                    <Box sx={{ flex: 1, minWidth: 0, mr: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box sx={{ display: 'flex', flexShrink: 0 }}>
                                                            {t.tipo === 'RECEITA' ? <TrendingUpIcon sx={{ color: 'success.main' }} /> : <TrendingDownIcon sx={{ color: 'error.main' }} />}
                                                        </Box>
                                                        <Typography variant="body1" fontWeight="bold" color="text.primary" noWrap>{t.descricao}</Typography>
                                                    </Box>
                                                    <Typography variant="h6" fontWeight="bold" color={t.tipo === 'RECEITA' ? 'success.main' : 'error.main'} sx={{ whiteSpace: 'nowrap' }}>
                                                        {t.tipo === 'RECEITA' ? '+' : '-'} {formatCurrency(t.valor)}
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>Nenhuma transação encontrada.</Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </Box>

                {/* Lado Direito: Perfil do Usuário e Saldo (Proporção 35) */}
                <Box sx={{ flex: 35, display: 'flex', flexDirection: 'column', gap: 4, height: '100%', minWidth: 0 }}>

                    {/* Saldo e Status */}
                    {perfil && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                p: 4,
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, #00e676 0%, #6d1b9b 100%)',
                                color: 'white',
                                flexShrink: 0
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                                <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1 }} fontWeight="bold" gutterBottom>Saldo Atual</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', lineHeight: 1, mt: 1 }}>
                                    {formatCurrency(perfil.saldo)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                                <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1 }} fontWeight="bold" gutterBottom>Status da Conta</Typography>
                                <Box
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        bgcolor: perfil.saldo >= 0 ? '#4caf50' : '#f44336',
                                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                                        border: '3px solid rgba(255,255,255,0.2)',
                                        mt: 1
                                    }}
                                />
                            </Box>
                        </Box>
                    )}

                    {/* Perfil do Usuário */}
                    <Card
                        sx={(theme) => ({
                            display: 'flex',
                            flexDirection: 'column',
                            p: 4,
                            borderRadius: 4,
                            position: 'relative',
                            flex: 1,
                            minHeight: 0,
                            boxShadow: theme.palette.mode === 'dark' ? '0 0 50px rgba(0, 230, 118, 0.4)' : '0 4px 40px rgba(0, 230, 118, 0.25)'
                        })}
                    >
                        <IconButton
                            sx={{ position: 'absolute', top: 16, right: 16, color: '#00e676', bgcolor: 'rgba(170,59,255,0.05)', '&:hover': { bgcolor: 'rgba(170,59,255,0.1)' } }}
                            onClick={handleOpenEdit}
                            title="Editar Perfil"
                        >
                            <SettingsIcon />
                        </IconButton>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                            <AccountCircleIcon sx={{ fontSize: 80, color: '#00e676', mb: 1 }} />
                            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold' }}>
                                {user.nome}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.email}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 1, overflowY: 'auto' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
                                <Typography variant="body2" color="text.secondary" fontWeight="bold">Login</Typography>
                                <Typography variant="body1" fontWeight="bold" color="text.primary" noWrap>{user.login}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
                                <Typography variant="body2" color="text.secondary" fontWeight="bold">Telefone</Typography>
                                <Typography variant="body1" fontWeight="bold" color="text.primary" noWrap>{user.telefone}</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Box>
            </Box>

            {/* Modal de Filtros do Histórico */}
            <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: 1, borderColor: 'divider' }}>
                    Filtrar Histórico
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 3 }}>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            value={filterTipo}
                            label="Tipo"
                            onChange={(e) => setFilterTipo(e.target.value)}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="RECEITA">Receita</MenuItem>
                            <MenuItem value="DESPESA">Despesa</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Periodicidade</InputLabel>
                        <Select
                            value={filterPeriodicidade}
                            label="Periodicidade"
                            onChange={(e) => setFilterPeriodicidade(e.target.value)}
                        >
                            <MenuItem value="">Todas</MenuItem>
                            <MenuItem value="UNICA">Única</MenuItem>
                            <MenuItem value="DIARIA">Diária</MenuItem>
                            <MenuItem value="SEMANAL">Semanal</MenuItem>
                            <MenuItem value="MENSAL">Mensal</MenuItem>
                            <MenuItem value="ANUAL">Anual</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 'bold' }}>Data Início</Typography>
                            <TextField
                                type="date"
                                value={filterDataInicio}
                                onChange={(e) => setFilterDataInicio(e.target.value)}
                                fullWidth
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 'bold' }}>Data Fim</Typography>
                            <TextField
                                type="date"
                                value={filterDataFim}
                                onChange={(e) => setFilterDataFim(e.target.value)}
                                fullWidth
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Button onClick={() => {
                        setFilterTipo('');
                        setFilterPeriodicidade('');
                        setFilterDataInicio('');
                        setFilterDataFim('');
                    }} color="inherit">
                        Limpar Filtros
                    </Button>
                    <Button onClick={() => setFilterDialogOpen(false)} variant="contained" color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Detalhes da Transação */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 'bold', color: '#00e676', borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                    Detalhes da Transação
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    {selectedTransacao && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
                                <Typography variant="body2" color="text.secondary" fontWeight="bold">Descrição</Typography>
                                <Typography variant="body1" fontWeight="bold" color="text.primary" noWrap>{selectedTransacao.descricao}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
                                <Typography variant="body2" color="text.secondary" fontWeight="bold">Valor</Typography>
                                <Typography variant="body1" color={selectedTransacao.tipo === 'RECEITA' ? 'success.main' : 'error.main'} fontWeight="bold">
                                    {formatCurrency(selectedTransacao.valor)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
                                <Typography variant="body2" color="text.secondary" fontWeight="bold">Data</Typography>
                                <Typography variant="body1" fontWeight="bold" color="text.primary">{formatDate(selectedTransacao.data)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
                                <Typography variant="body2" color="text.secondary" fontWeight="bold">Tipo</Typography>
                                <Typography variant="body1" fontWeight="bold" color="text.primary">{selectedTransacao.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
                    <Button onClick={handleDeleteTransacao} variant="outlined" color="error" sx={{ borderRadius: 2 }}>
                        Excluir
                    </Button>
                    <Button onClick={handleCloseDialog} variant="contained" sx={{ borderRadius: 2, bgcolor: '#00e676', '&:hover': { bgcolor: '#00c853' } }}>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Edição de Perfil */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 'bold', color: '#00e676', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsIcon /> Editar Perfil
                </DialogTitle>
                <form onSubmit={handleSubmit(onEditSubmit)}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                        <TextField
                            label="Nome"
                            variant="outlined"
                            fullWidth
                            {...register("nome")}
                            error={!!errors.nome}
                            helperText={errors.nome?.message as string}
                        />
                        <TextField
                            label="Login"
                            variant="outlined"
                            fullWidth
                            {...register("login")}
                            error={!!errors.login}
                            helperText={errors.login?.message as string}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            type="email"
                            fullWidth
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message as string}
                        />
                        <TextField
                            label="Telefone"
                            variant="outlined"
                            fullWidth
                            {...register("telefone")}
                            error={!!errors.telefone}
                            helperText={errors.telefone?.message as string}
                        />
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Button variant="outlined" color="secondary" onClick={() => setOpenPasswordDialog(true)} fullWidth>Alterar senha</Button>
                            <Button variant="outlined" color="error" onClick={() => setOpenDeleteDialog(true)} fullWidth>Apagar conta</Button>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button onClick={() => setEditDialogOpen(false)} color="inherit" sx={{ borderRadius: 2 }}>Cancelar</Button>
                        <Button type="submit" variant="contained" sx={{ borderRadius: 2, bgcolor: '#00e676', '&:hover': { bgcolor: '#00c853' } }}>Salvar</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Apagar Conta</DialogTitle>
                <DialogContent>
                    <Typography>
                        Tem certeza que deseja apagar sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button onClick={handleDeleteAccount} variant="contained" color="error">
                        Apagar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
                <DialogTitle>Alterar Senha</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, minWidth: 300 }}>
                    {dialogErro && (
                        <Alert severity="error">{dialogErro}</Alert>
                    )}
                    <TextField
                        variant="outlined"
                        label="Senha (antiga)"
                        type="password"
                        value={senhaAntiga}
                        onChange={(e) => setSenhaAntiga(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        variant="outlined"
                        label="Nova senha"
                        type="password"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        variant="outlined"
                        label="Confirmação de Nova senha"
                        type="password"
                        value={confirmarNovaSenha}
                        onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPasswordDialog(false)}>Cancelar</Button>
                    <Button onClick={handleAlterarSenha} variant="contained" color="primary">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

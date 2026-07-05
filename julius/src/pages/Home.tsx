import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Grid, Card, CardContent, 
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, CircularProgress, Alert, Tooltip, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

interface IObjetivoFinanceiro {
    id?: number;
    nome: string;
    valor: number;
    prazo: string;
    prioridade: number;
    status: 'PENDENTE' | 'CONCLUIDO';
    planoFinanceiroId?: number;
}

interface IPlanoFinanceiro {
    id?: number;
    nome: string;
    dataCriacao: string;
    usuarioId: number;
    economiaMensalNecessaria: number;
    objetivos: IObjetivoFinanceiro[];
}

const planoSchema = yup.object({
    nome: yup.string().required("Nome é obrigatório"),
    dataCriacao: yup.string().required("Data de criação é obrigatória"),
}).required();

const objetivoSchema = yup.object({
    nome: yup.string().required("Nome é obrigatório"),
    valor: yup.number().typeError("Valor numérico obrigatório").required(),
    prazo: yup.string().required(),
    prioridade: yup.number().typeError("Prioridade numérica obrigatória").required(),
    status: yup.mixed<'PENDENTE' | 'CONCLUIDO'>().oneOf(['PENDENTE', 'CONCLUIDO']).required()
}).required();

export default function Home() {
    const navigate = useNavigate();
    const { usuarioId } = useAuth();
    const [planos, setPlanos] = useState<IPlanoFinanceiro[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [planoIndex, setPlanoIndex] = useState(0);
    
    // Modal Plano State
    const [openPlano, setOpenPlano] = useState(false);
    const [planoAtual, setPlanoAtual] = useState<IPlanoFinanceiro | null>(null);

    // Modal Objetivo State
    const [openObjetivo, setOpenObjetivo] = useState(false);
    const [objetivoAtual, setObjetivoAtual] = useState<IObjetivoFinanceiro | null>(null);
    const [planoSelecionadoId, setPlanoSelecionadoId] = useState<number | null>(null);

    const formPlano = useForm<IPlanoFinanceiro>({
        resolver: yupResolver(planoSchema) as any
    });

    const formObjetivo = useForm<IObjetivoFinanceiro>({
        resolver: yupResolver(objetivoSchema) as any
    });

    const carregarPlanos = async () => {
        try {
            setCarregando(true);
            const response = await axios.get('/planosFinanceiros');
            const userPlanos = response.data.filter((p: IPlanoFinanceiro) => Number(p.usuarioId) === Number(usuarioId));
            setPlanos(userPlanos);
            if (planoIndex >= userPlanos.length) {
                setPlanoIndex(Math.max(0, userPlanos.length - 1));
            }
        } catch (err) {
            setErro('Erro ao carregar seus planos financeiros.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (usuarioId) {
            carregarPlanos();
        }
    }, [usuarioId]);

    const calcularEconomiaMensal = (objetivos: IObjetivoFinanceiro[] = []) => {
        const pendentes = objetivos.filter(o => o.status !== "CONCLUIDO");
        if (pendentes.length === 0) return 0;
        
        const hoje = new Date();
        let totalMensal = 0;
        
        for (const obj of pendentes) {
            const prazo = new Date(obj.prazo);
            const diffMeses = (prazo.getFullYear() - hoje.getFullYear()) * 12 + (prazo.getMonth() - hoje.getMonth());
            const mesesRestantes = Math.max(diffMeses, 1);
            totalMensal += obj.valor / mesesRestantes;
        }
        
        return totalMensal;
    };

    const calcularTotalDespesa = (objetivos: IObjetivoFinanceiro[] = []) => {
        return objetivos.reduce((acc, obj) => acc + obj.valor, 0);
    };

    const handlePrevPlano = () => {
        setPlanoIndex((prev) => (prev > 0 ? prev - 1 : planos.length - 1));
    };

    const handleNextPlano = () => {
        setPlanoIndex((prev) => (prev < planos.length - 1 ? prev + 1 : 0));
    };

    // --- Actions for Plano Financeiro ---
    const handleOpenPlano = (plano?: IPlanoFinanceiro) => {
        if (plano) {
            setPlanoAtual(plano);
            formPlano.setValue('nome', plano.nome);
            formPlano.setValue('dataCriacao', new Date(plano.dataCriacao).toISOString().split('T')[0]);
        } else {
            setPlanoAtual(null);
            formPlano.reset();
            formPlano.setValue('dataCriacao', new Date().toISOString().split('T')[0]);
        }
        setOpenPlano(true);
    };

    const onSubmitPlano = async (data: any) => {
        try {
            data.usuarioId = usuarioId!;
            data.economiaMensalNecessaria = 0;
            if (data.dataCriacao && !data.dataCriacao.includes('T')) {
                data.dataCriacao = `${data.dataCriacao}T00:00:00.000Z`;
            }
            if (planoAtual?.id) {
                await axios.put(`/planosFinanceiros/${planoAtual.id}`, data);
            } else {
                await axios.post('/planosFinanceiros', data);
            }
            setOpenPlano(false);
            carregarPlanos();
        } catch (err) {
            alert('Erro ao salvar o plano financeiro.');
        }
    };

    const handleDeletePlano = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este plano?')) {
            try {
                await axios.delete(`/planosFinanceiros/${id}`);
                carregarPlanos();
            } catch (err) {
                alert('Erro ao excluir plano.');
            }
        }
    };

    // --- Actions for Objetivo Financeiro ---
    const handleOpenObjetivo = (planoId: number, objetivo?: IObjetivoFinanceiro) => {
        setPlanoSelecionadoId(planoId);
        if (objetivo) {
            setObjetivoAtual(objetivo);
            formObjetivo.setValue('nome', objetivo.nome);
            formObjetivo.setValue('valor', objetivo.valor);
            formObjetivo.setValue('prazo', new Date(objetivo.prazo).toISOString().split('T')[0]);
            formObjetivo.setValue('prioridade', objetivo.prioridade);
            formObjetivo.setValue('status', objetivo.status);
        } else {
            setObjetivoAtual(null);
            formObjetivo.reset();
            formObjetivo.setValue('status', 'PENDENTE');
            formObjetivo.setValue('prazo', new Date().toISOString().split('T')[0]);
        }
        setOpenObjetivo(true);
    };

    const onSubmitObjetivo = async (data: any) => {
        try {
            data.planoFinanceiroId = planoSelecionadoId!;
            if (data.prazo && !data.prazo.includes('T')) {
                data.prazo = `${data.prazo}T00:00:00.000Z`;
            }
            if (objetivoAtual?.id) {
                await axios.put(`/objetivosFinanceiros/${objetivoAtual.id}`, data);
            } else {
                await axios.post('/objetivosFinanceiros', data);
            }
            setOpenObjetivo(false);
            carregarPlanos();
        } catch (err) {
            alert('Erro ao salvar o objetivo financeiro.');
        }
    };

    const handleDeleteObjetivo = async () => {
        if (objetivoAtual?.id && window.confirm('Excluir este objetivo?')) {
            try {
                await axios.delete(`/objetivosFinanceiros/${objetivoAtual.id}`);
                setOpenObjetivo(false);
                carregarPlanos();
            } catch (err) {
                alert('Erro ao excluir objetivo.');
            }
        }
    };

    const menuItems = [
        { 
            title: 'Análises de Impacto', 
            icon: <AutoGraphIcon sx={{ fontSize: 32, color: '#ff9800' }} />, 
            desc: 'Avalie como suas decisões afetam seus planos.',
            path: '/analises',
            color: '#fff3e0'
        },
        { 
            title: 'Relatórios Mensais', 
            icon: <AssessmentIcon sx={{ fontSize: 32, color: '#4caf50' }} />, 
            desc: 'Acompanhe seu progresso ao longo do tempo.',
            path: '/relatorios',
            color: '#e8f5e9'
        },
        { 
            title: 'Despesas', 
            icon: <TrendingDownIcon sx={{ fontSize: 32, color: '#f44336' }} />, 
            desc: 'Gerencie e adicione novas despesas.',
            path: '/despesa',
            color: '#ffebee'
        },
        { 
            title: 'Receitas', 
            icon: <TrendingUpIcon sx={{ fontSize: 32, color: '#2196f3' }} />, 
            desc: 'Gerencie e adicione novas receitas.',
            path: '/receita',
            color: '#e3f2fd'
        }
    ];

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 6, flexGrow: 1, width: '100%' }}>
                {/* Lado Esquerdo: Planos Financeiros (aprox 65%) */}
                <Box sx={{ flex: 65, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                    {carregando ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress sx={{ color: '#aa3bff' }} /></Box>
                    ) : erro ? (
                        <Alert severity="error">{erro}</Alert>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {planos.length === 0 ? (
                                <Card sx={(theme) => ({ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', p: 0, borderRadius: 4, boxShadow: theme.palette.mode === 'dark' ? '0 0 50px rgba(0, 230, 118, 0.4)' : '0 4px 40px rgba(0, 230, 118, 0.25)' })}>
                                <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 4, border: '1px dashed', borderColor: 'divider' }}>
                                    <Typography variant="body1" color="textSecondary">Nenhum plano financeiro encontrado. Crie um para começar!</Typography>
                                </Box>
                                </Card>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {planos.length > 1 && (
                                        <IconButton onClick={handlePrevPlano} sx={{ bgcolor: 'transparent', width: 40, height: 40, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                                            <ChevronLeftIcon />
                                        </IconButton>
                                    )}
                                    
                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: 'var(--text-h)' }}>
                                                <AccountBalanceWalletIcon sx={{ mr: 1, color: '#aa3bff' }} /> Meus Planos Financeiros
                                            </Typography>
                                            <Button 
                                                variant="contained" 
                                                startIcon={<AddIcon />} 
                                                onClick={() => handleOpenPlano()} 
                                                sx={{ ml: 2, backgroundColor: '#aa3bff', '&:hover': { backgroundColor: '#8a2be2' }, borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}
                                            >
                                                NOVO PLANO
                                            </Button>
                                        </Box>
                                        
                                        {(() => {
                                            const plano = planos[planoIndex];
                                            if (!plano) return null;
                                            const economiaMensal = calcularEconomiaMensal(plano.objetivos);
                                            const totalDespesa = calcularTotalDespesa(plano.objetivos);
                                            return (
                                                <Card key={plano.id} sx={(theme) => ({ 
                                                    borderRadius: 6, 
                                                    bgcolor: 'background.paper', 
                                                    border: 'none',
                                                    boxShadow: theme.palette.mode === 'dark' ? '0 0 50px rgba(0, 230, 118, 0.4)' : '0 4px 40px rgba(0, 230, 118, 0.25)',
                                                    p: 4,
                                                    overflow: 'visible'
                                                })}>
                                                    {/* Top Row */}
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                                                        <Box>
                                                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                                                {plano.nome}
                                                            </Typography>
                                                            {planos.length > 1 && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Plano {planoIndex + 1} de {planos.length}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                        <Box sx={{ textAlign: 'right' }}>
                                                            <Box sx={{ p: 2, bgcolor: 'rgba(170, 59, 255, 0.05)', borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#aa3bff' }}>
                                                                    Economia Mensal
                                                                </Typography>
                                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#aa3bff' }}>
                                                                    R$ {economiaMensal.toFixed(2)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    {/* Middle Row (Objectives) */}
                                                    <Box sx={{ my: 4 }}>
                                                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 'bold', fontSize: '0.85rem' }}>
                                                            OBJETIVOS DO PLANO
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            <Grid item>
                                                                <Card 
                                                                    onClick={() => handleOpenObjetivo(plano.id!)}
                                                                    sx={{ 
                                                                        borderRadius: 3, 
                                                                        bgcolor: 'background.paper', 
                                                                        border: '1px dashed #ccc',
                                                                        px: 3, py: 1.5,
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        gap: 1,
                                                                        transition: 'all 0.2s',
                                                                        boxShadow: 'none',
                                                                        '&:hover': { borderColor: '#aa3bff', backgroundColor: 'rgba(170, 59, 255, 0.05)' }
                                                                    }}
                                                                >
                                                                    <AddIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                                                        Novo
                                                                    </Typography>
                                                                </Card>
                                                            </Grid>
                                                            
                                                            {plano.objetivos && plano.objetivos.map(obj => (
                                                                <Grid item key={obj.id}>
                                                                    <Card 
                                                                        onClick={() => handleOpenObjetivo(plano.id!, obj)}
                                                                        sx={{ 
                                                                            borderRadius: 3, 
                                                                            bgcolor: 'background.paper', 
                                                                            border: '1px solid #eee',
                                                                            px: 3, py: 1.5,
                                                                            cursor: 'pointer',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 1,
                                                                            transition: 'all 0.2s',
                                                                            boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                                                                            '&:hover': { borderColor: '#aa3bff', transform: 'scale(1.02)' }
                                                                        }}
                                                                    >
                                                                        {obj.status === 'CONCLUIDO' 
                                                                            ? <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} /> 
                                                                            : <RadioButtonUncheckedIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                                                                        }
                                                                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }} noWrap>
                                                                            {obj.nome}
                                                                        </Typography>
                                                                    </Card>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </Box>

                                                    {/* Bottom Row */}
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
                                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.9rem' }}>
                                                            {new Date(plano.dataCriacao).toLocaleDateString('pt-BR')}
                                                        </Typography>
                                                        
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                                                Total de Despesas: <span style={{ color: '#aa3bff' }}>R$ {totalDespesa.toFixed(2)}</span>
                                                            </Typography>
                                                            <Box>
                                                                <Tooltip title="Editar Plano">
                                                                    <IconButton size="small" sx={{ color: '#1976d2', mr: 1 }} onClick={() => handleOpenPlano(plano)}>
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Excluir Plano">
                                                                    <IconButton size="small" sx={{ color: '#d32f2f' }} onClick={() => handleDeletePlano(plano.id!)}>
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            );
                                        })()}
                                    </Box>
                                    
                                    {planos.length > 1 && (
                                        <IconButton onClick={handleNextPlano} sx={{ bgcolor: 'transparent', width: 40, height: 40, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                                            <ChevronRightIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>

                {/* Lado Direito: Menu Empilhado (aprox 35%) */}
                <Box sx={{ flex: 35, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 7 }}>
                        {menuItems.map((item, index) => (
                            <Card 
                                key={index}
                                onClick={() => navigate(item.path)}
                                sx={{ 
                                    display: 'flex', alignItems: 'center', p: 3, cursor: 'pointer',
                                    transition: 'all 0.3s', borderRadius: 4,
                                    bgcolor: 'background.paper', border: '1px solid #eee',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    '&:hover': { transform: 'translateX(-5px)', boxShadow: '0 6px 16px rgba(0,0,0,0.08)', borderColor: item.color }
                                }}
                            >
                                <Box sx={{ color: item.color, mr: 2, display: 'flex' }}>{item.icon}</Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{item.title}</Typography>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Modal de Plano Financeiro */}
            <Dialog open={openPlano} onClose={() => setOpenPlano(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
                    {planoAtual ? 'Editar Plano' : 'Novo Plano'}
                </DialogTitle>
                <form onSubmit={formPlano.handleSubmit(onSubmitPlano)}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Nome do Plano" fullWidth {...formPlano.register("nome")} error={!!formPlano.formState.errors.nome} helperText={formPlano.formState.errors.nome?.message} />
                        <TextField label="Data de Criação" type="date" fullWidth InputLabelProps={{ shrink: true }} {...formPlano.register("dataCriacao")} error={!!formPlano.formState.errors.dataCriacao} helperText={formPlano.formState.errors.dataCriacao?.message} />
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button onClick={() => setOpenPlano(false)} color="inherit" sx={{ borderRadius: 2 }}>Cancelar</Button>
                        <Button type="submit" variant="contained" sx={{ backgroundColor: '#aa3bff', '&:hover': { backgroundColor: '#8a2be2' }, borderRadius: 2 }}>Salvar</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Modal de Objetivo Financeiro */}
            <Dialog open={openObjetivo} onClose={() => setOpenObjetivo(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <form onSubmit={formObjetivo.handleSubmit(onSubmitObjetivo)}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {objetivoAtual ? 'Editar Objetivo' : 'Novo Objetivo'}
                        </Typography>
                        <TextField label="Nome" fullWidth {...formObjetivo.register("nome")} error={!!formObjetivo.formState.errors.nome} helperText={formObjetivo.formState.errors.nome?.message} />
                        <TextField label="Valor (R$)" type="number" fullWidth inputProps={{ step: "0.01" }} {...formObjetivo.register("valor")} error={!!formObjetivo.formState.errors.valor} helperText={formObjetivo.formState.errors.valor?.message} />
                        <TextField label="Prazo" type="date" fullWidth InputLabelProps={{ shrink: true }} {...formObjetivo.register("prazo")} error={!!formObjetivo.formState.errors.prazo} helperText={formObjetivo.formState.errors.prazo?.message} />
                        <TextField label="Prioridade" type="number" fullWidth {...formObjetivo.register("prioridade")} error={!!formObjetivo.formState.errors.prioridade} helperText={formObjetivo.formState.errors.prioridade?.message} />
                        <TextField select label="Status" fullWidth {...formObjetivo.register("status")} defaultValue="PENDENTE" error={!!formObjetivo.formState.errors.status} helperText={formObjetivo.formState.errors.status?.message}>
                            <MenuItem value="PENDENTE">Pendente</MenuItem>
                            <MenuItem value="CONCLUIDO">Concluído</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
                        {objetivoAtual ? (
                            <Tooltip title="Excluir Objetivo">
                                <IconButton color="error" onClick={handleDeleteObjetivo}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        ) : <Box />}
                        
                        <Box>
                            <Button onClick={() => setOpenObjetivo(false)} color="inherit" sx={{ mr: 1, borderRadius: 2 }}>Cancelar</Button>
                            <Tooltip title="Salvar Objetivo">
                                <IconButton type="submit" sx={{ backgroundColor: '#aa3bff', color: 'white', '&:hover': { backgroundColor: '#8a2be2' } }}>
                                    <SaveIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

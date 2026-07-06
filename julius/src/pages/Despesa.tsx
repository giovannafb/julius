import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

import { Box, Typography, Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Card, Grid, IconButton, CircularProgress, Chip } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RepeatIcon from '@mui/icons-material/Repeat';

interface ITransacao {
    descricao: string;
    valor: number;
    data: string;
    periodicidade: string;
    tipo?: string;
}

interface IDespesa {
    transacaoId?: number;
    perfilEconomicoId?: number;
    transacao: ITransacao;
}

const schema = yup.object({
    descricao: yup.string().required("Descrição é obrigatória"),
    valor: yup.number().typeError("Valor deve ser numérico").positive("Valor deve ser positivo").required("Valor é obrigatório"),
    data: yup.string().required("Data é obrigatória"),
    periodicidade: yup.string().oneOf(['UNICA', 'DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL']).required("Periodicidade é obrigatória")
}).required();

export default function Despesa() {
    const { usuarioId } = useAuth();
    const [despesas, setDespesas] = useState<IDespesa[]>([]);
    const [perfilId, setPerfilId] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [despesaAtual, setDespesaAtual] = useState<IDespesa | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema) as any
    });

    const carregarDados = async () => {
        try {
            setLoading(true);
            const perfilRes = await axios.get(`/perfisEconomicos/usuario/${usuarioId}`);
            const pid = perfilRes.data.id;
            setPerfilId(pid);

            const res = await axios.get('/despesas');
            setDespesas(res.data.filter((d: IDespesa) => d.perfilEconomicoId === pid));
        } catch (err) {
            console.error("Erro ao carregar despesas", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (usuarioId) carregarDados();
    }, [usuarioId]);

    const onSubmit = async (data: any) => {
        try {
            if (data.data && !data.data.includes('T')) {
                data.data = `${data.data}T00:00:00.000Z`;
            }
            const payload = {
                ...data,
                perfilEconomicoId: perfilId
            };
            if (despesaAtual && despesaAtual.transacaoId) {
                await axios.put(`/despesas/${despesaAtual.transacaoId}`, payload);
            } else {
                await axios.post('/despesas', payload);
            }
            fecharModal();
            carregarDados();
        } catch (err) {
            alert('Erro ao salvar despesa');
        }
    };

    const abrirModalNovo = () => {
        setDespesaAtual(null);
        reset({ descricao: '', valor: undefined, data: '', periodicidade: 'MENSAL' });
        setOpenModal(true);
    };

    const abrirModalEditar = (desp: IDespesa) => {
        setDespesaAtual(desp);
        reset({
            descricao: desp.transacao.descricao,
            valor: desp.transacao.valor,
            data: desp.transacao.data.split('T')[0],
            periodicidade: desp.transacao.periodicidade
        });
        setOpenModal(true);
    };

    const fecharModal = () => {
        setOpenModal(false);
        setDespesaAtual(null);
        reset();
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Deseja realmente excluir esta despesa?")) {
            try {
                await axios.delete(`/despesas/${id}`);
                carregarDados();
            } catch (err) {
                alert('Erro ao excluir despesa');
            }
        }
    };

    const handleClearAll = async () => {
        if (!despesas.length) return;
        if (window.confirm("Deseja realmente excluir TODAS as despesas? Esta ação não pode ser desfeita.")) {
            try {
                await Promise.all(despesas.map(d => axios.delete(`/despesas/${d.transacaoId}`)));
                carregarDados();
            } catch (err) {
                console.error("Erro ao excluir todas as despesas:", err);
                alert('Erro ao excluir todas as despesas');
            }
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingDownIcon sx={{ color: 'error.main', fontSize: 48 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Minhas Despesas
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton 
                        color="error"
                        onClick={handleClearAll}
                        disabled={despesas.length === 0}
                        sx={{ bgcolor: 'rgba(244,67,54,0.05)', '&:hover': { bgcolor: 'rgba(244,67,54,0.1)' }, borderRadius: 2 }}
                        title="Excluir Todas"
                    >
                        <CleaningServicesIcon />
                    </IconButton>
                    <Button 
                        variant="contained" 
                        color="error" 
                        startIcon={<AddIcon />}
                        onClick={abrirModalNovo}
                        sx={{ borderRadius: 2, fontWeight: 'bold' }}
                    >
                        Nova Despesa
                    </Button>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
            ) : (
                <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                    {despesas.length === 0 ? (
                        <Card sx={{ p: 5, textAlign: 'center', border: '1px dashed #ccc', bgcolor: 'transparent', boxShadow: 'none' }}>
                            <Typography color="text.secondary">Você ainda não cadastrou nenhuma despesa.</Typography>
                        </Card>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {despesas.map((desp) => (
                                <Card 
                                    key={desp.transacaoId} 
                                    onClick={() => abrirModalEditar(desp)}
                                    sx={{ 
                                        p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                                        bgcolor: 'background.paper', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                                        transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
                                        '&:hover': { transform: 'scale(1.01)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } 
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ bgcolor: 'error.light', borderRadius: '50%', p: 1, display: 'flex', flexShrink: 0 }}>
                                            <AttachMoneyIcon sx={{ color: 'error.dark' }} />
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', lineHeight: 1.2 }}>
                                                {desp.transacao.descricao}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                                <Chip icon={<CalendarMonthIcon fontSize="small" />} label={new Date(desp.transacao.data).toLocaleDateString('pt-BR')} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.03)', color: 'text.secondary', fontWeight: 'bold', borderRadius: 2 }} />
                                                <Chip icon={<RepeatIcon fontSize="small" />} label={desp.transacao.periodicidade} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.03)', color: 'text.secondary', fontWeight: 'bold', borderRadius: 2 }} />
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
                                            - R$ {desp.transacao.valor.toFixed(2)}
                                        </Typography>
                                        <IconButton size="small" color="error" onClick={(e) => handleDelete(desp.transacaoId!, e)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            <Dialog open={openModal} onClose={fecharModal} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 'bold', color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingDownIcon /> {despesaAtual ? 'Editar Despesa' : 'Adicionar Despesa'}
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Descrição" placeholder="Ex: Conta de Luz" slotProps={{ inputLabel: { shrink: true } }} {...register("descricao")} error={!!errors.descricao} helperText={errors.descricao?.message} />
                        <TextField label="Valor (R$)" type="number" slotProps={{ htmlInput: { step: "0.01" }, inputLabel: { shrink: true } }} {...register("valor")} error={!!errors.valor} helperText={errors.valor?.message} />
                        <TextField label="Data" type="date" slotProps={{ inputLabel: { shrink: true } }} {...register("data")} error={!!errors.data} helperText={errors.data?.message} />
                        <TextField select label="Periodicidade" defaultValue="MENSAL" {...register("periodicidade")} error={!!errors.periodicidade} helperText={errors.periodicidade?.message}>
                            <MenuItem value="UNICA">Única</MenuItem>
                            <MenuItem value="DIARIA">Diária</MenuItem>
                            <MenuItem value="SEMANAL">Semanal</MenuItem>
                            <MenuItem value="MENSAL">Mensal</MenuItem>
                            <MenuItem value="ANUAL">Anual</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button onClick={fecharModal} color="inherit" sx={{ borderRadius: 2 }}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="error" sx={{ borderRadius: 2 }}>Salvar</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

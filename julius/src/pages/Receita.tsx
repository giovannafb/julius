import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

import { Box, Typography, Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Card, Grid, IconButton, CircularProgress, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import RepeatIcon from '@mui/icons-material/Repeat';

interface ITransacao {
    descricao: string;
    valor: number;
    data: string;
    periodicidade: string;
    tipo?: string;
}

interface IReceita {
    transacaoId?: number;
    fonte: string;
    perfilEconomicoId?: number;
    transacao: ITransacao;
}

const schema = yup.object({
    descricao: yup.string().required("Descrição é obrigatória"),
    valor: yup.number().typeError("Valor deve ser numérico").positive("Valor deve ser positivo").required("Valor é obrigatório"),
    data: yup.string().required("Data é obrigatória"),
    periodicidade: yup.string().oneOf(['UNICA', 'DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL']).required("Periodicidade é obrigatória"),
    fonte: yup.string().required("Fonte é obrigatória")
}).required();

export default function Receita() {
    const { usuarioId } = useAuth();
    const [receitas, setReceitas] = useState<IReceita[]>([]);
    const [perfilId, setPerfilId] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [receitaAtual, setReceitaAtual] = useState<IReceita | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema) as any
    });

    const carregarDados = async () => {
        try {
            setLoading(true);
            // 1. Busca perfil economico do usuário
            const perfilRes = await axios.get(`/perfisEconomicos/usuario/${usuarioId}`);
            const pid = perfilRes.data.id;
            setPerfilId(pid);

            // 2. Busca receitas e filtra
            const res = await axios.get('/receitas');
            setReceitas(res.data.filter((r: IReceita) => r.perfilEconomicoId === pid));
        } catch (err) {
            console.error("Erro ao carregar receitas", err);
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
            if (receitaAtual && receitaAtual.transacaoId) {
                await axios.put(`/receitas/${receitaAtual.transacaoId}`, payload);
            } else {
                await axios.post('/receitas', payload);
            }
            fecharModal();
            carregarDados();
        } catch (err) {
            alert('Erro ao salvar receita');
        }
    };

    const abrirModalNovo = () => {
        setReceitaAtual(null);
        reset({ descricao: '', valor: undefined, data: '', periodicidade: 'MENSAL', fonte: '' });
        setOpenModal(true);
    };

    const abrirModalEditar = (rec: IReceita) => {
        setReceitaAtual(rec);
        reset({
            descricao: rec.transacao.descricao,
            valor: rec.transacao.valor,
            data: rec.transacao.data.split('T')[0],
            periodicidade: rec.transacao.periodicidade,
            fonte: rec.fonte
        });
        setOpenModal(true);
    };

    const fecharModal = () => {
        setOpenModal(false);
        setReceitaAtual(null);
        reset();
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Deseja realmente excluir esta receita?")) {
            try {
                await axios.delete(`/receitas/${id}`);
                carregarDados();
            } catch (err) {
                alert('Erro ao excluir receita');
            }
        }
    };

    const handleClearAll = async () => {
        if (!receitas.length) return;
        if (window.confirm("Deseja realmente excluir TODAS as receitas? Esta ação não pode ser desfeita.")) {
            try {
                await Promise.all(receitas.map(r => axios.delete(`/receitas/${r.transacaoId}`)));
                carregarDados();
            } catch (err) {
                console.error("Erro ao excluir todas as receitas:", err);
                alert('Erro ao excluir todas as receitas');
            }
        }
    };

    return (
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 48 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Minhas Receitas
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton 
                        color="error"
                        onClick={handleClearAll}
                        disabled={receitas.length === 0}
                        sx={{ bgcolor: 'rgba(244,67,54,0.05)', '&:hover': { bgcolor: 'rgba(244,67,54,0.1)' }, borderRadius: 2 }}
                        title="Excluir Todas"
                    >
                        <CleaningServicesIcon />
                    </IconButton>
                    <Button 
                        variant="contained" 
                        color="success" 
                        startIcon={<AddIcon />}
                        onClick={abrirModalNovo}
                        sx={{ borderRadius: 2, fontWeight: 'bold' }}
                    >
                        Nova Receita
                    </Button>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
            ) : (
                <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                    {receitas.length === 0 ? (
                        <Card sx={{ p: 5, textAlign: 'center', border: '1px dashed #ccc', bgcolor: 'transparent', boxShadow: 'none' }}>
                            <Typography color="text.secondary">Você ainda não cadastrou nenhuma receita.</Typography>
                        </Card>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {receitas.map((rec) => (
                                <Card 
                                    key={rec.transacaoId} 
                                    onClick={() => abrirModalEditar(rec)}
                                    sx={{ 
                                        p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                                        bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                                        transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
                                        '&:hover': { transform: 'scale(1.01)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } 
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ bgcolor: 'success.light', borderRadius: '50%', p: 1, display: 'flex', flexShrink: 0 }}>
                                            <AttachMoneyIcon sx={{ color: 'success.dark' }} />
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', lineHeight: 1.2 }}>
                                                {rec.transacao.descricao}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                                <Chip icon={<CalendarMonthIcon fontSize="small" />} label={new Date(rec.transacao.data).toLocaleDateString('pt-BR')} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.03)', color: 'text.secondary', fontWeight: 'bold', borderRadius: 2 }} />
                                                <Chip icon={<BusinessCenterIcon fontSize="small" />} label={rec.fonte} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.03)', color: 'text.secondary', fontWeight: 'bold', borderRadius: 2 }} />
                                                <Chip icon={<RepeatIcon fontSize="small" />} label={rec.transacao.periodicidade} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.03)', color: 'text.secondary', fontWeight: 'bold', borderRadius: 2 }} />
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                                            + R$ {rec.transacao.valor.toFixed(2)}
                                        </Typography>
                                        <IconButton size="small" color="error" onClick={(e) => handleDelete(rec.transacaoId!, e)}>
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
                <DialogTitle sx={{ fontWeight: 'bold', color: 'success.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon /> {receitaAtual ? 'Editar Receita' : 'Adicionar Receita'}
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Descrição" placeholder="Ex: Salário" {...register("descricao")} error={!!errors.descricao} helperText={errors.descricao?.message} />
                        <TextField label="Valor (R$)" type="number" inputProps={{ step: "0.01" }} {...register("valor")} error={!!errors.valor} helperText={errors.valor?.message} />
                        <TextField label="Data" type="date" InputLabelProps={{ shrink: true }} {...register("data")} error={!!errors.data} helperText={errors.data?.message} />
                        <TextField select label="Periodicidade" defaultValue="MENSAL" {...register("periodicidade")} error={!!errors.periodicidade} helperText={errors.periodicidade?.message}>
                            <MenuItem value="UNICA">Única</MenuItem>
                            <MenuItem value="DIARIA">Diária</MenuItem>
                            <MenuItem value="SEMANAL">Semanal</MenuItem>
                            <MenuItem value="MENSAL">Mensal</MenuItem>
                            <MenuItem value="ANUAL">Anual</MenuItem>
                        </TextField>
                        <TextField label="Fonte" placeholder="Ex: Empresa X" {...register("fonte")} error={!!errors.fonte} helperText={errors.fonte?.message} />
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button onClick={fecharModal} color="inherit" sx={{ borderRadius: 2 }}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="success" sx={{ borderRadius: 2 }}>Salvar</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

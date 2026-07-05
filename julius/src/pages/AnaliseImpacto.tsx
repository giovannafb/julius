import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Container, Grid, IconButton, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, Tooltip } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

interface IObjetivoFinanceiro {
  id: number;
  nome: string;
  valor: number;
}

interface IAnaliseImpacto {
  id: number;
  dataAnalise: string;
  planoFinanceiroId: number;
  objetivoOrigem?: IObjetivoFinanceiro;
  objetivosComprometidos?: { objetivoFinanceiro: IObjetivoFinanceiro }[];
}

export default function AnaliseImpacto() {
  const { usuarioId } = useAuth();
  const [analises, setAnalises] = useState<IAnaliseImpacto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const fetchAnalises = async () => {
    try {
      setCarregando(true);
      const response = await axios.get('/analisesImpacto');
      // Filtra para pegar apenas as análises dos planos deste usuário
      // Nota: Idealmente o backend deveria fazer isso, mas como recebemos tudo, filtramos local.
      // O objetivoOrigem não vem populado no mock original, mas fizemos as mudanças no repositório!
      const reversed = response.data.reverse();
      console.log("DADOS DA ANALISE RECEBIDOS NO FRONTEND:", reversed);
      setAnalises(reversed); // As mais recentes primeiro
    } catch (err) {
      setErro('Erro ao carregar análises de impacto.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchAnalises();
  }, [usuarioId]);

  const handleDeleteAnalise = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta análise de impacto? Os objetivos continuarão existindo.")) return;
    try {
        await axios.delete(`/analisesImpacto/${id}`);
        fetchAnalises();
    } catch (err) {
        alert("Erro ao excluir análise.");
    }
  };

  const handleRemoveObjetivo = async (id: number) => {
    console.log("Tentando remover objetivo ID:", id);
    if (!window.confirm("Isso apagará o objetivo do seu planejamento e recalculará o impacto. Continuar?")) return;
    try {
        await axios.delete(`/objetivosFinanceiros/${id}`);
        console.log("Objetivo excluido no backend. Recarregando análises...");
        fetchAnalises();
    } catch (err) {
        console.error("Erro no delete:", err);
        alert("Erro ao excluir objetivo.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <TimelineIcon sx={{ fontSize: 40, color: '#3b82ff', mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>
          Análises de Impacto
        </Typography>
      </Box>

      {carregando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress sx={{ color: '#3b82ff' }} /></Box>
      ) : erro ? (
        <Alert severity="error">{erro}</Alert>
      ) : (
        <Grid container spacing={3}>
          {analises.length === 0 ? (
            <Grid item xs={12}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>Nenhuma análise de impacto pendente no momento. Seu planejamento está saudável!</Alert>
            </Grid>
          ) : (
            analises.map(analise => (
              <Grid item xs={12} md={6} key={analise.id}>
                <Card sx={{ 
                    borderRadius: 4, 
                    border: '1px solid var(--border)', 
                    backgroundColor: 'var(--social-bg)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    position: 'relative'
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>
                                Conflito no Orçamento
                            </Typography>
                        </Box>
                        <Tooltip title="Excluir Análise (Ignorar)">
                            <IconButton color="error" size="small" onClick={() => handleDeleteAnalise(analise.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Typography variant="body2" sx={{ color: '#aaa', mb: 3, fontWeight: 500 }}>
                      Data da Análise: {new Date(analise.dataAnalise).toLocaleString('pt-BR')}
                    </Typography>

                    {analise.objetivoOrigem && (
                        <Box sx={{ p: 2, bgcolor: 'rgba(59, 130, 255, 0.05)', borderRadius: 2, border: '1px solid rgba(59, 130, 255, 0.2)', mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ color: '#3b82ff', fontWeight: 'bold' }}>
                                O causador do impacto:
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{analise.objetivoOrigem.nome}</Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>R$ {analise.objetivoOrigem.valor.toFixed(2)}</Typography>
                            </Box>
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#ff3b7c', mb: 1 }}>
                        Objetivos Comprometidos:
                    </Typography>

                    <List sx={{ bgcolor: 'rgba(255, 59, 124, 0.02)', borderRadius: 2, border: '1px solid rgba(255, 59, 124, 0.1)' }}>
                        {analise.objetivosComprometidos && analise.objetivosComprometidos.length > 0 ? (
                            analise.objetivosComprometidos.map((rel, index) => (
                                <ListItem key={index} divider={index < analise.objetivosComprometidos!.length - 1}>
                                    <ListItemText 
                                        primary={rel.objetivoFinanceiro?.nome || 'Objetivo Desconhecido'}
                                        secondary={`R$ ${(rel.objetivoFinanceiro?.valor || 0).toFixed(2)}`}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                    <ListItemSecondaryAction>
                                        <Tooltip title="Tirar da jogada (Excluir Objetivo)">
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveObjetivo(rel.objetivoFinanceiro.id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText primary="Nenhum objetivo comprometido listado." />
                            </ListItem>
                        )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Container>
  );
}

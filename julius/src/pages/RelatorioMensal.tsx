import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Container, Grid, MenuItem, Select, FormControl, InputLabel, Divider } from '@mui/material';
import axios from '../api/axios';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../auth/AuthContext';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function RelatorioMensal() {
  const { usuarioId } = useAuth();
  
  // Último mês finalizado
  const hoje = new Date();
  const mesInicial = hoje.getMonth() === 0 ? 11 : hoje.getMonth() - 1;
  const [mesSelecionado, setMesSelecionado] = useState<number>(mesInicial);
  
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  
  const [receitas, setReceitas] = useState<any[]>([]);
  const [despesas, setDespesas] = useState<any[]>([]);
  const [objetivos, setObjetivos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!usuarioId) return;
      try {
        setCarregando(true);
        const [resPerfil, resPlanos] = await Promise.all([
          axios.get(`/perfisEconomicos/usuario/${usuarioId}`).catch(() => ({ data: null })),
          axios.get('/planosFinanceiros').catch(() => ({ data: [] }))
        ]);

        if (resPerfil.data) {
          setReceitas(resPerfil.data.receitasFixas || []);
          setDespesas(resPerfil.data.despesasFixas || []);
        }

        const userPlanos = resPlanos.data.filter((p: any) => Number(p.usuarioId) === Number(usuarioId));
        const todosObjetivos = userPlanos.flatMap((p: any) => p.objetivos || []);
        setObjetivos(todosObjetivos);
        
      } catch (err) {
        setErro('Erro ao carregar dados do relatório.');
      } finally {
        setCarregando(false);
      }
    };
    fetchData();
  }, [usuarioId]);

  // Cálculos Automáticos para o mês selecionado
  const receitasMes = receitas.filter(r => new Date(r.transacao.data).getMonth() === mesSelecionado);
  const despesasMes = despesas.filter(d => new Date(d.transacao.data).getMonth() === mesSelecionado);
  const objetivosMes = objetivos.filter(o => new Date(o.prazo).getMonth() === mesSelecionado);

  const totalReceitas = receitasMes.reduce((acc, r) => acc + r.transacao.valor, 0);
  const totalDespesas = despesasMes.reduce((acc, d) => acc + d.transacao.valor, 0);
  const saldoFinal = totalReceitas - totalDespesas;

  const totalObj = objetivosMes.length;
  const concluidosObj = objetivosMes.filter(o => o.status === 'CONCLUIDO').length;
  const percentObj = totalObj > 0 ? Math.round((concluidosObj / totalObj) * 100) : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AssessmentIcon sx={{ fontSize: 40, color: '#aa3bff', mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>
            Relatório de Desempenho
          </Typography>
        </Box>
        
        <FormControl sx={{ minWidth: 200, backgroundColor: 'var(--social-bg)', borderRadius: 2 }} variant="outlined" size="small">
          <InputLabel>Mês de Análise</InputLabel>
          <Select
            value={mesSelecionado}
            label="Mês de Análise"
            onChange={(e) => setMesSelecionado(Number(e.target.value))}
            sx={{ borderRadius: 2, fontWeight: 'bold', color: '#aa3bff' }}
          >
            {MESES.map((mes, index) => (
              <MenuItem key={index} value={index}>{mes}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {carregando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress sx={{ color: '#aa3bff' }} /></Box>
      ) : erro ? (
        <Alert severity="error">{erro}</Alert>
      ) : (
        <Card sx={(theme) => ({ 
            borderRadius: 6, 
            border: 'none', 
            background: 'linear-gradient(145deg, var(--card-bg) 0%, rgba(170,59,255,0.03) 100%)',
            boxShadow: theme.palette.mode === 'dark' ? '0 0 50px rgba(0, 230, 118, 0.4)' : '0 4px 40px rgba(0, 230, 118, 0.25)',
            p: { xs: 2, md: 4 },
            overflow: 'visible'
        })}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, color: 'var(--text-h)', textAlign: 'center' }}>
              Resumo de {MESES[mesSelecionado]}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              {/* Receitas */}
              <Box sx={{ flex: 1, display: 'flex' }}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, borderRadius: 4, bgcolor: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                  <TrendingUpIcon sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Receitas Totais</Typography>
                  <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold', mt: 1 }}>
                    R$ {totalReceitas.toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
              </Box>

              {/* Despesas */}
              <Box sx={{ flex: 1, display: 'flex' }}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, borderRadius: 4, bgcolor: 'rgba(244, 67, 54, 0.1)', border: '1px solid rgba(244, 67, 54, 0.2)' }}>
                  <TrendingDownIcon sx={{ fontSize: 48, color: '#f44336', mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Despesas Totais</Typography>
                  <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold', mt: 1 }}>
                    R$ {totalDespesas.toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
              </Box>

              {/* Saldo Final */}
              <Box sx={{ flex: 1, display: 'flex' }}>
                <Box sx={{ 
                    width: '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, borderRadius: 4, 
                    background: saldoFinal >= 0 ? 'linear-gradient(135deg, #aa3bff 0%, #8a2be2 100%)' : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', opacity: 0.9 }}>Saldo Final</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                    R$ {saldoFinal.toFixed(2).replace('.', ',')}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 5, opacity: 0.5 }} />

            {/* Objetivos Concluídos */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--text-h)', mb: 3 }}>
                Desempenho de Objetivos no Mês
              </Typography>
              
              <Box sx={{ 
                  position: 'relative', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'rgba(170,59,255,0.05)',
                  borderRadius: '50%',
                  p: 4,
                  border: '8px solid rgba(170,59,255,0.2)'
              }}>
                <CircularProgress 
                    variant="determinate" 
                    value={percentObj} 
                    size={160}
                    thickness={4}
                    sx={{ color: '#aa3bff', position: 'absolute' }} 
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: percentObj === 100 ? '#4caf50' : '#aa3bff', mb: 1 }} />
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>
                    {percentObj}%
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
                {totalObj === 0 
                  ? 'Nenhum objetivo com prazo para este mês.' 
                  : `Você concluiu ${concluidosObj} de ${totalObj} objetivo(s).`}
              </Typography>
            </Box>

          </CardContent>
        </Card>
      )}
    </Container>
  );
}

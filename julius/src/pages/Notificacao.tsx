import { useEffect, useState } from 'react';
import { Box, Typography, Card, CircularProgress, Alert, Container, List, ListItem, ListItemText, ListItemIcon, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

interface INotificacao {
  id: number;
  mensagem: string;
  dataEnvio: string;
  lida: boolean;
  usuarioId: number;
}

export default function Notificacao() {
  const { usuarioId } = useAuth();
  const [notificacoes, setNotificacoes] = useState<INotificacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchNotificacoes = async () => {
      if (!usuarioId) return;
      try {
        const response = await axios.get('/notificacoes');
        const myNotifs = response.data.filter((n: any) => 
            n.analiseImpacto?.planoFinanceiro?.usuarioId === Number(usuarioId)
        );
        
        // Ordena da mais recente para mais antiga
        myNotifs.sort((a: any, b: any) => new Date(b.dataEnvio).getTime() - new Date(a.dataEnvio).getTime());
        setNotificacoes(myNotifs);

        // Marcar como lidas
        const unreadNotifs = myNotifs.filter((n: any) => !n.lida);
        for (const unread of unreadNotifs) {
            await axios.put(`/notificacoes/${unread.id}`, { lida: true }).catch(() => {});
        }
      } catch (err) {
        setErro('Erro ao carregar notificações.');
      } finally {
        setCarregando(false);
      }
    };
    fetchNotificacoes();
  }, [usuarioId]);

  const handleDelete = async (id: number) => {
      try {
          await axios.delete(`/notificacoes/${id}`);
          setNotificacoes(prev => prev.filter(n => n.id !== id));
      } catch (err) {
          setErro('Erro ao apagar notificação.');
      }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <NotificationsIcon sx={{ fontSize: 40, color: '#ff3b7c', mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>
          Minhas Notificações
        </Typography>
      </Box>

      {carregando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress sx={{ color: '#ff3b7c' }} /></Box>
      ) : erro ? (
        <Alert severity="error">{erro}</Alert>
      ) : (
        <Card sx={{ borderRadius: 4, border: '1px solid var(--border)', backgroundColor: 'var(--social-bg)' }}>
            {notificacoes.length === 0 ? (
                <Alert severity="info" sx={{ m: 2, borderRadius: 2 }}>Nenhuma notificação no momento.</Alert>
            ) : (
                <List>
                    {notificacoes.map((notif, index) => (
                        <ListItem
                            key={notif.id}
                            divider={index < notificacoes.length - 1}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDelete(notif.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemIcon>
                                <NotificationsIcon color={notif.lida ? "disabled" : "primary"} />
                            </ListItemIcon>
                            <ListItemText 
                                primary={notif.mensagem}
                                secondary={new Date(notif.dataEnvio).toLocaleString('pt-BR')}
                                primaryTypographyProps={{ fontWeight: notif.lida ? 'normal' : 'bold', color: 'var(--text-h)' }}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Card>
      )}
    </Container>
  );
}

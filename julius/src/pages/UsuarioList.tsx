import { useEffect, useState } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Card, CardContent, 
  Container, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  login: string;
  telefone: string;
}

export default function UsuarioList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const carregarUsuarios = async () => {
    try {
      setCarregando(true);
      const response = await axios.get('/usuarios');
      setUsuarios(response.data);
    } catch (err: any) {
      setErro('Erro ao carregar os usuários.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.delete(`/usuarios/${id}`);
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (err) {
        alert('Erro ao excluir usuário.');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
          Lista de Usuários
        </Typography>
        <Button variant="contained" onClick={() => navigate('/usuario/novo')}>
          Novo Usuário
        </Button>
      </Box>

      {carregando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : erro ? (
        <Alert severity="error">{erro}</Alert>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Login</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Telefone</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.login}</TableCell>
                  <TableCell>{usuario.telefone}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => navigate(`/usuario/editar/${usuario.id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(usuario.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {usuarios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

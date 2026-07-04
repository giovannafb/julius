import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../auth/AuthContext';

// Importando os componentes do MUI
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Snackbar, Alert } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

interface IUsuario {
    nome: string;
    login: string;
    senha: string;
    email: string;
    telefone: string;
}

const schema: yup.ObjectSchema<IUsuario> = yup.object({
    nome: yup.string().required("Nome é obrigatório"),
    login: yup.string().required("Login é obrigatório"),
    senha: yup.string().required("Senha é obrigatória").min(6, "Senha deve ter no mínimo 6 caracteres"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    telefone: yup.string().length(11, "Telefone deve ter 11 dígitos").required("Telefone é obrigatório")
}).required();

function Usuario() {
    const navigate = useNavigate();
    const { id } = useParams(); // Se houver ID, é edição
    const isEditing = !!id;
    const { logout } = useAuth();

    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [senhaAntiga, setSenhaAntiga] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
    const [dialogErro, setDialogErro] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<IUsuario>({
        resolver: yupResolver(schema) as any
    });

    useEffect(() => {
        if (isEditing) {
            // Carregar os dados do usuário para edição
            const carregarUsuario = async () => {
                try {
                    const response = await axios.get(`/usuarios/${id}`);
                    const user = response.data;
                    setValue('nome', user.nome);
                    setValue('login', user.login);
                    setValue('email', user.email);
                    setValue('telefone', user.telefone);
                    // Não carregamos a senha por segurança
                } catch (err) {
                    setErro('Erro ao carregar os dados do usuário.');
                }
            };
            carregarUsuario();
        }
    }, [id, isEditing, setValue]);

    const onSubmit = async (data: IUsuario) => {
        try {
            if (isEditing) {
                await axios.put(`/usuarios/${id}`, data);
                setSucesso('Usuário atualizado com sucesso!');
            } else {
                await axios.post('/usuarios', data);
                setSucesso('Usuário cadastrado com sucesso!');
            }
            setTimeout(() => {
                navigate('/'); // Volta pra listagem ou plano financeiro
            }, 1500);
        } catch (err: any) {
            setErro(err.response?.data?.message || 'Erro ao salvar o usuário.');
        }
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`/usuarios/${id}`);
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
            const loginAtual = getValues('login');
            if (!loginAtual) {
                setDialogErro('Login não preenchido no formulário principal.');
                return;
            }

            try {
                await axios.post('/auth/login', { login: loginAtual, senha: senhaAntiga });
            } catch (err: any) {
                setDialogErro('Senha antiga incorreta.');
                return;
            }

            const data = getValues();
            data.senha = novaSenha;
            await axios.put(`/usuarios/${id}`, data);
            
            setSucesso('Senha alterada com sucesso!');
            setOpenPasswordDialog(false);
            setSenhaAntiga('');
            setNovaSenha('');
            setConfirmarNovaSenha('');
            setValue('senha', novaSenha);
        } catch (err: any) {
            setDialogErro('Erro ao alterar a senha.');
        }
    };

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit(onSubmit)}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <AccountCircleIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h4" component="h1" color="primary" sx={{ fontWeight: 'bold' }}>
                    {isEditing ? 'Editar Perfil' : 'Cadastro'}
                </Typography>
            </Box>

            <TextField 
                variant="outlined"
                label="Nome" 
                placeholder="Ex: João da Silva"
                {...register("nome")}
                error={!!errors.nome}
                helperText={errors.nome?.message}
                slotProps={{ inputLabel: { shrink: isEditing ? true : undefined } }}
            />

            <TextField 
                variant="outlined"
                label="Login" 
                placeholder="Ex: joaosilva123"
                {...register("login")}
                error={!!errors.login}
                helperText={errors.login?.message}
                slotProps={{ inputLabel: { shrink: isEditing ? true : undefined } }}
            />

            <TextField 
                variant="outlined"
                label="Email" 
                type="email"
                placeholder="Ex: usuario@example.com"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                slotProps={{ inputLabel: { shrink: isEditing ? true : undefined } }}
            />

            <TextField 
                variant="outlined"
                label="Telefone" 
                placeholder="Ex: 11987654321"
                {...register("telefone")}
                error={!!errors.telefone}
                helperText={errors.telefone?.message}
                slotProps={{ inputLabel: { shrink: isEditing ? true : undefined } }}
            />

            <TextField 
                variant="outlined"
                label="Senha" 
                type="password" 
                placeholder="Mínimo de 6 caracteres"
                {...register("senha")}
                error={!!errors.senha}
                helperText={errors.senha?.message}
                slotProps={{ inputLabel: { shrink: isEditing ? true : undefined } }}
            />

            <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
                {isEditing ? 'Salvar' : 'Cadastrar'}
            </Button>
            
            {isEditing && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={() => setOpenPasswordDialog(true)} 
                        fullWidth
                    >
                        Alterar senha
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="error" 
                        onClick={() => setOpenDeleteDialog(true)} 
                        fullWidth
                    >
                        Apagar conta
                    </Button>
                </Box>
            )}
            
            <Button variant="text" onClick={() => navigate(-1)} sx={{ mt: 1 }}>
                Voltar
            </Button>

            <Snackbar open={!!erro} autoHideDuration={4000} onClose={() => setErro('')}>
                <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>
            </Snackbar>
            <Snackbar open={!!sucesso} autoHideDuration={4000} onClose={() => setSucesso('')}>
                <Alert severity="success" onClose={() => setSucesso('')}>{sucesso}</Alert>
            </Snackbar>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Apagar Conta</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza que deseja apagar sua conta? Esta ação é irreversível.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button onClick={handleDelete} variant="contained" color="error">
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

export default Usuario;
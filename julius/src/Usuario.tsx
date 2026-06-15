import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Importando os componentes do MUI
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
    senha: yup.string().min(6, "Senha deve ter no mínimo 6 caracteres").required("Senha é obrigatória"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    telefone: yup.string().length(11, "Telefone deve ter 11 dígitos").required("Telefone é obrigatório")
}).required();

function Usuario() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IUsuario>({
        resolver: yupResolver(schema) as any
    });

    const onSubmit = (data: IUsuario) => {
        console.log('Usuário cadastrado: ', data);
        alert(`Nome: ${data.nome}\nLogin: ${data.login}\nEmail: ${data.email}\nSenha: ${data.senha}\nTelefone: ${data.telefone}`);
    }

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
                mt: 8, // Margem no topo aumentada para centralizar melhor na tela
                p: 4, // Preenchimento interno (padding)
                boxShadow: 3, // Dá uma sombra elegante para destacar o formulário do fundo branco
                borderRadius: 2 // Arredonda as bordas do formulário
            }}
        >
            {/* Cabeçalho com Ícone e Título */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <AccountCircleIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography 
                    variant="h4" 
                    component="h1" 
                    color="primary" 
                    sx={{ fontWeight: 'bold' }} 
                >
                    Cadastro
                </Typography>
            </Box>

            <TextField 
                variant="outlined"
                label="Nome" 
                placeholder="Ex: João da Silva"
                slotProps={{}}
                {...register("nome")}
                error={!!errors.nome}
                helperText={errors.nome?.message}
            />

            <TextField 
                variant="outlined"
                label="Login" 
                placeholder="Ex: joaosilva123"
                slotProps={{}}
                {...register("login")}
                error={!!errors.login}
                helperText={errors.login?.message}
            />

            <TextField 
                variant="outlined"
                label="Email" 
                type="email"
                placeholder="Ex: usuario@example.com"
                slotProps={{}}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
            />

            <TextField 
                variant="outlined"
                label="Telefone" 
                placeholder="Ex: 11987654321"
                slotProps={{}}
                {...register("telefone")}
                error={!!errors.telefone}
                helperText={errors.telefone?.message}
            />

            <TextField 
                variant="outlined"
                label="Senha" 
                type="password" 
                placeholder="Mínimo de 6 caracteres"
                slotProps={{}}
                {...register("senha")}
                error={!!errors.senha}
                helperText={errors.senha?.message}
            />

            <Button 
                type="submit" 
                variant="contained" 
                size="large" // Deixa o botão um pouco maior e mais clicável
                sx={{ mt: 2 }} // Adiciona um pequeno espaço extra acima do botão
            >
                Entrar
            </Button>
        </Box>
    );
}

export default Usuario;
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface IPlanoFinanceiro {
    nome: string;
    saldoAtual: number;
    dataCriacao: string;
    usuarioId: number;
}

const schema: yup.ObjectSchema<IPlanoFinanceiro> = yup.object({
    nome: yup.string().required("Nome é obrigatório"),
    saldoAtual: yup.number().typeError("Saldo deve ser numérico").required("Saldo é obrigatório"),
    dataCriacao: yup.string().required("Data de criação é obrigatória"),
    usuarioId: yup.number().typeError("ID do usuário deve ser um número").required("ID do usuário é obrigatório")
}).required();

function PlanoFinanceiro() {
    const { register, handleSubmit, formState: { errors } } = useForm<IPlanoFinanceiro>({
        resolver: yupResolver(schema) as any
    });

    const onSubmit = (data: IPlanoFinanceiro) => {
        console.log('Plano Financeiro cadastrado: ', data);
        alert(`Nome: ${data.nome}\nSaldo Atual: R$ ${data.saldoAtual}\nData de Criação: ${data.dataCriacao}\nID do Usuário: ${data.usuarioId}`);
    }

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit(onSubmit)}
            sx={{ 
                display: 'flex', flexDirection: 'column', gap: 2, 
                maxWidth: 400, margin: '0 auto', mt: 8, p: 4, 
                boxShadow: 3, borderRadius: 2 
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <AccountBalanceWalletIcon color="info" sx={{ fontSize: 40 }} />
                <Typography variant="h4" component="h1" color="info.main" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Plano Financeiro
                </Typography>
            </Box>

            <TextField variant="outlined" label="Nome do Plano" placeholder="Ex: Planejamento 2026" {...register("nome")} error={!!errors.nome} helperText={errors.nome?.message} />
            <TextField variant="outlined" label="Saldo Atual (R$)" type="number" placeholder="Ex: 10000" slotProps={{ htmlInput: { step: "0.01" } }} {...register("saldoAtual")} error={!!errors.saldoAtual} helperText={errors.saldoAtual?.message} />
            <TextField variant="outlined" label="Data de Criação" type="date" slotProps={{ inputLabel: { shrink: true } }} {...register("dataCriacao")} error={!!errors.dataCriacao} helperText={errors.dataCriacao?.message} />
            <TextField variant="outlined" label="ID do Usuário" type="number" placeholder="Ex: 1" {...register("usuarioId")} error={!!errors.usuarioId} helperText={errors.usuarioId?.message} />
            
            <Button type="submit" variant="contained" color="info" size="large" sx={{ mt: 2 }}>
                Criar Plano
            </Button>
        </Box>
    );
}

export default PlanoFinanceiro;

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FlagIcon from '@mui/icons-material/Flag';

interface IObjetivoFinanceiro {
    nome: string;
    valor: number;
    prazo: string;
    prioridade: number;
    status: string;
    planoFinanceiroId: number;
}

const schema: yup.ObjectSchema<IObjetivoFinanceiro> = yup.object({
    nome: yup.string().required("Nome é obrigatório"),
    valor: yup.number().typeError("Valor deve ser numérico").positive("Valor deve ser positivo").required("Valor é obrigatório"),
    prazo: yup.string().required("Prazo é obrigatório"),
    prioridade: yup.number().typeError("Prioridade deve ser um número").min(1).max(10).required("Prioridade é obrigatória"),
    status: yup.string().oneOf(['PENDENTE', 'CONCLUIDO']).required("Status é obrigatório"),
    planoFinanceiroId: yup.number().typeError("ID do Plano Financeiro deve ser numérico").required("ID é obrigatório")
}).required();

function ObjetivoFinanceiro() {
    const { register, handleSubmit, formState: { errors } } = useForm<IObjetivoFinanceiro>({
        resolver: yupResolver(schema) as any
    });

    const onSubmit = (data: IObjetivoFinanceiro) => {
        console.log('Objetivo Financeiro cadastrado: ', data);
        alert(`Nome: ${data.nome}\nValor: R$ ${data.valor}\nPrazo: ${data.prazo}\nPrioridade: ${data.prioridade}\nStatus: ${data.status}\nPlano ID: ${data.planoFinanceiroId}`);
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
                <FlagIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h4" component="h1" color="primary" sx={{ fontWeight: 'bold' }}>
                    Objetivo
                </Typography>
            </Box>

            <TextField variant="outlined" label="Nome" placeholder="Ex: Viagem para Paris" {...register("nome")} error={!!errors.nome} helperText={errors.nome?.message} />
            <TextField variant="outlined" label="Valor (R$)" type="number" placeholder="Ex: 5000" slotProps={{ htmlInput: { step: "0.01" } }} {...register("valor")} error={!!errors.valor} helperText={errors.valor?.message} />
            <TextField variant="outlined" label="Prazo" type="date" slotProps={{ inputLabel: { shrink: true } }} {...register("prazo")} error={!!errors.prazo} helperText={errors.prazo?.message} />
            <TextField variant="outlined" label="Prioridade" type="number" placeholder="1 a 10" {...register("prioridade")} error={!!errors.prioridade} helperText={errors.prioridade?.message} />
            <TextField select variant="outlined" label="Status" defaultValue="PENDENTE" {...register("status")} error={!!errors.status} helperText={errors.status?.message}>
                <MenuItem value="PENDENTE">Pendente</MenuItem>
                <MenuItem value="CONCLUIDO">Concluído</MenuItem>
            </TextField>
            <TextField variant="outlined" label="ID do Plano Financeiro" type="number" placeholder="Ex: 1" {...register("planoFinanceiroId")} error={!!errors.planoFinanceiroId} helperText={errors.planoFinanceiroId?.message} />
            
            <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
                Cadastrar
            </Button>
        </Box>
    );
}

export default ObjetivoFinanceiro;

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface IReceita {
    descricao: string;
    valor: number;
    data: string;
    periodicidade: string;
    fonte: string;
}

const schema: yup.ObjectSchema<IReceita> = yup.object({
    descricao: yup.string().required("Descrição é obrigatória"),
    valor: yup.number().typeError("Valor deve ser numérico").positive("Valor deve ser positivo").required("Valor é obrigatório"),
    data: yup.string().required("Data é obrigatória"),
    periodicidade: yup.string().oneOf(['UNICA', 'DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL']).required("Periodicidade é obrigatória"),
    fonte: yup.string().required("Fonte é obrigatória")
}).required();

function Receita() {
    const { register, handleSubmit, formState: { errors } } = useForm<IReceita>({
        resolver: yupResolver(schema) as any
    });

    const onSubmit = (data: IReceita) => {
        console.log('Receita cadastrada: ', data);
        alert(`Descrição: ${data.descricao}\nValor: R$ ${data.valor}\nData: ${data.data}\nPeriodicidade: ${data.periodicidade}\nFonte: ${data.fonte}`);
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
                <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                <Typography variant="h4" component="h1" color="success.main" sx={{ fontWeight: 'bold' }}>
                    Nova Receita
                </Typography>
            </Box>

            <TextField variant="outlined" label="Descrição" placeholder="Ex: Salário" {...register("descricao")} error={!!errors.descricao} helperText={errors.descricao?.message} />
            <TextField variant="outlined" label="Valor (R$)" type="number" placeholder="Ex: 3500" slotProps={{ htmlInput: { step: "0.01" } }} {...register("valor")} error={!!errors.valor} helperText={errors.valor?.message} />
            <TextField variant="outlined" label="Data" type="date" slotProps={{ inputLabel: { shrink: true } }} {...register("data")} error={!!errors.data} helperText={errors.data?.message} />
            
            <TextField select variant="outlined" label="Periodicidade" defaultValue="MENSAL" {...register("periodicidade")} error={!!errors.periodicidade} helperText={errors.periodicidade?.message}>
                <MenuItem value="UNICA">Única</MenuItem>
                <MenuItem value="DIARIA">Diária</MenuItem>
                <MenuItem value="SEMANAL">Semanal</MenuItem>
                <MenuItem value="MENSAL">Mensal</MenuItem>
                <MenuItem value="ANUAL">Anual</MenuItem>
            </TextField>

            <TextField variant="outlined" label="Fonte" placeholder="Ex: Empresa X" {...register("fonte")} error={!!errors.fonte} helperText={errors.fonte?.message} />
            
            <Button type="submit" variant="contained" color="success" size="large" sx={{ mt: 2 }}>
                Cadastrar Receita
            </Button>
        </Box>
    );
}

export default Receita;

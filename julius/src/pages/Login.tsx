import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
interface ILogin {
    email: string;
    senha: string;
}

const schema = yup.object({
    email: yup.string().email('Email inválido').required("Email é obrigatório"),
    senha: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres!').required("senha é obrigatória")
}).required();

function Login() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ILogin>({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data: ILogin) => {
        console.log('Login enviado: ', data);
        alert(`Email: ${data.email}, Senha: ${data.senha}`);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='email'>Email:</label>
                    <input id="email" {...register("email")} />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email.message}</div>}
                </div>

                <div>
                    <label htmlFor="senha">Senha:</label>
                    <input type="password" id="senha" {...register("senha")} />
                    {errors.senha && <div style={{ color: 'red' }}>{errors.senha.message}</div>}
                </div>

                <button type='submit'>Enviar</button>

            </form>
        </>
    );
}


export default Login;
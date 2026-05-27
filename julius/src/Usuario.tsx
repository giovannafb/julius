import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface IUsuario{
    nome: string;
    login: string;
    senha: string;
    email: string;
    telefone: string;
}

const schema = yup.object({
    nome: yup.string().required("Nome é obrigatório"),
    login: yup.string().required("Login é obrigatório"),
    senha: yup.string().min(6, "Senha deve ter no mínimo 6 caracteres").required("Senha é obrigatório"),
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    telefone: yup.string().length(11, "Telefone inválido").required("Telefone é obrigatório")
}).required()

function Usuario(){

    const {
            register,
            handleSubmit,
            formState: { errors }
        } = useForm<IUsuario>({
            resolver: yupResolver(schema)
        });

        const onSubmit = (data: IUsuario) => {
            console.log('Usuário cadastrado: ', data);
            alert(`Nome: ${data.nome}, Login: ${data.login}, Email: ${data.email}, Senha: ${data.senha}, Telefone: ${data.telefone}`);
        }

    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input id='nome' {...register("nome")}/>
                    {errors.nome && <div style={{ color: 'red' }}>{errors.nome.message}</div>}
                </div>

                <div>
                    <label htmlFor="login">Login:</label>
                    <input id='login' {...register("login")}/>
                    {errors.login && <div style={{ color: 'red' }}>{errors.login.message}</div>}
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input id='email' {...register("email")}/>
                    {errors.email && <div style={{ color: 'red' }}>{errors.email.message}</div>}
                </div>

                <div>
                    <label htmlFor="telefone">Telefone:</label>
                    <input id='telefone' {...register("telefone")}/>
                    {errors.telefone && <div style={{ color: 'red' }}>{errors.telefone.message}</div>}
                </div>

                <div>
                    <label htmlFor="senha">Senha:</label>
                    <input type='password' id='senha' {...register("senha")}/>
                    {errors.senha && <div style={{ color: 'red' }}>{errors.senha.message}</div>}
                </div>

                <button type='submit'>Enviar</button>


            </form>
        
        </>
    )
}

export default Usuario;
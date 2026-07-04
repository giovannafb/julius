import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import * as authRepository from '../repositories/auth.repository.js';
export const loginController = async (request: FastifyRequest<{
    Body: {
        login: string,
        senha: string
    }
}>, reply: FastifyReply): Promise<void> => {
    const { login, senha } = request.body;
    if (!login || !senha) {
        reply.status(400).send({ message: 'Login e senha são obrigatórios.' });
        return;
    }
    const usuario = await authRepository.findUsuarioByLogin(login);
    if (!usuario) {
        reply.status(401).send({ message: 'Usuário não encontrado.' });
        return;
    }
    const senhaValida = await argon2.verify(usuario.senha, senha);
    if (!senhaValida) {
        reply.status(401).send({ message: 'Senha inválida.' });
        return;
    }
    const token = jwt.sign(
        { id: usuario.id, login: usuario.login, email: usuario.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
    );
    reply.status(200).send({ message: 'Login realizado com sucesso!', token, usuarioId: usuario.id });
};
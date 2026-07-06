import type { FastifyRequest, FastifyReply } from 'fastify';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import type { Usuario } from '../../generated/prisma/client.js';
import argon2 from 'argon2'; // Adicione o import
import { prisma } from '../../lib/prisma.js';

export class UsuarioController {
    private usuarioRepository = new UsuarioRepository();

    post = async (
        request: FastifyRequest<{ Body: Omit<Usuario, 'id'> }>,
        reply: FastifyReply
    ) => {
        const dados = request.body;
        const senhaHash = await argon2.hash(dados.senha);
        request.body.senha = senhaHash;
        const json = await this.usuarioRepository.create(request.body);
        
        // Criar perfil econômico zerado e com histórico para o novo usuário
        await prisma.perfilEconomico.create({
            data: {
                usuarioId: json.id,
                saldo: 0,
                status: true,
                historico: {
                    create: {}
                }
            }
        });

        reply.status(201).send(json);
    };

    get = async (_: FastifyRequest, reply: FastifyReply) => {
        const json = await this.usuarioRepository.findAll();
        reply.status(200).send(json);
    };

    getParamId = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const json = await this.usuarioRepository.findById(Number(request.params.id));
        json ? reply.status(200).send(json) : reply.status(404).send({ message: 'Usuario not found' });
    };

    putParamId = async (
        request: FastifyRequest<{ Params: { id: string }, Body: Partial<Omit<Usuario, 'id'>> }>,
        reply: FastifyReply
    ) => {
        try {
            const dados = request.body;
            if (dados.senha) {
                const senhaHash = await argon2.hash(dados.senha);
                request.body.senha = senhaHash;
            }
            const json = await this.usuarioRepository.update(Number(request.params.id), request.body);
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Usuario not found' });
        }
    };

    deleteParamId = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const json = await this.usuarioRepository.delete(Number(request.params.id));
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Usuario not found' });
        }
    };
}

export const usuarioController = new UsuarioController();
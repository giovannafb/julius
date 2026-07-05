import type { FastifyRequest, FastifyReply } from 'fastify';
import { PerfilEconomicoRepository } from '../repositories/PerfilEconomicoRepository.js';
import type { PerfilEconomico } from '../../generated/prisma/client.js';

type IdParams = { Params: { id: string } };

export class PerfilEconomicoController {
    private repository = new PerfilEconomicoRepository();

    post = async (request: FastifyRequest<{ Body: Omit<PerfilEconomico, 'id'> }>, reply: FastifyReply) => {
        const json = await this.repository.create(request.body);
        reply.status(201).send(json);
    };

    get = async (_: FastifyRequest, reply: FastifyReply) => {
        const json = await this.repository.findAll();
        reply.send(json);
    };

    getParamId = async (request: FastifyRequest<{Params: { id: string }}>, reply: FastifyReply) => {
        const json = await this.repository.findById(Number(request.params.id));
        json ? reply.send(json) : reply.status(404).send({ message: 'Not found' });
    };

    getByUsuarioId = async (request: FastifyRequest<{Params: { usuarioId: string }}>, reply: FastifyReply) => {
        const json = await this.repository.findByUsuarioIdWithDetails(Number(request.params.usuarioId));
        json ? reply.send(json) : reply.status(404).send({ message: 'Perfil Econômico não encontrado para este usuário.' });
    };

    putParamId = async (request: FastifyRequest<IdParams & { Body: Omit<PerfilEconomico, 'id'> }>, reply: FastifyReply) => {
        try {
            const json = await this.repository.update(Number(request.params.id), request.body);
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Not found' });
        }
    };

    deleteParamId = async (request: FastifyRequest<IdParams>, reply: FastifyReply) => {
        try {
            const json = await this.repository.delete(Number(request.params.id));
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Not found' });
        }
    };
}

export const perfilEconomicoController = new PerfilEconomicoController();
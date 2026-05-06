import type { FastifyRequest, FastifyReply } from 'fastify';
import { NotificacaoRepository } from '../repositories/NotificacaoRepository.js';
import type { Notificacao } from '../../generated/prisma/client.js';

export class NotificacaoController {
    private repository = new NotificacaoRepository();

    post = async (
        request: FastifyRequest<{ Body: Omit<Notificacao, 'id'> }>,
        reply: FastifyReply
    ) => {
        const json = await this.repository.create(request.body);
        reply.status(201).send(json);
    };

    get = async (_: FastifyRequest, reply: FastifyReply) => {
        const json = await this.repository.findAll();
        reply.status(200).send(json);
    };

    getParamId = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const json = await this.repository.findById(Number(request.params.id));
        json ? reply.status(200).send(json) : reply.status(404).send({ message: 'Notificacao not found' });
    };

    putParamId = async (
        request: FastifyRequest<{ Params: { id: string }, Body: Omit<Notificacao, 'id'> }>,
        reply: FastifyReply
    ) => {
        try {
            const json = await this.repository.update(Number(request.params.id), request.body);
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Notificacao not found' });
        }
    };

    deleteParamId = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const json = await this.repository.delete(Number(request.params.id));
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Notificacao not found' });
        }
    };
}

export const notificacaoController = new NotificacaoController();
import type { FastifyRequest, FastifyReply } from 'fastify';
import { HistoricoRepository } from '../repositories/HistoricoRepository.js';
import type { Historico } from '../../generated/prisma/client.js';

export class HistoricoController {
    private historicoRepository = new HistoricoRepository();

    post = async (
        request: FastifyRequest<{ Body: Omit<Historico, 'id'> }>,
        reply: FastifyReply
    ) => {
        const json = await this.historicoRepository.create(request.body);
        reply.status(201).send(json);
    };

    get = async (_: FastifyRequest, reply: FastifyReply) => {
        const json = await this.historicoRepository.findAll();
        reply.status(200).send(json);
    };

    getParamId = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const json = await this.historicoRepository.findById(Number(request.params.id));
        json ? reply.status(200).send(json) : reply.status(404).send({ message: 'Historico not found' });
    };

    putParamId = async (
        request: FastifyRequest<{ Params: { id: string }, Body: Omit<Historico, 'id'> }>,
        reply: FastifyReply
    ) => {
        try {
            const json = await this.historicoRepository.update(Number(request.params.id), request.body);
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Historico not found' });
        }
    };

    deleteParamId = async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const json = await this.historicoRepository.delete(Number(request.params.id));
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Historico not found' });
        }
    };
}

export const historicoController = new HistoricoController();
import type { FastifyRequest, FastifyReply } from 'fastify';
import { DespesaRepository } from '../repositories/DespesaRepository.js';
import type { Despesa } from '../../generated/prisma/client.js';

export class DespesaController {
    private repository = new DespesaRepository();

    post = async (
        request: FastifyRequest<{ Body: Despesa }>,
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
        json ? reply.status(200).send(json) : reply.status(404).send({ message: 'Despesa not found' });
    };

    putParamId = async (
        request: FastifyRequest<{ Params: { id: string }, Body: Partial<Despesa> }>,
        reply: FastifyReply
    ) => {
        try {
            const json = await this.repository.update(Number(request.params.id), request.body);
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Despesa not found' });
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
            reply.status(404).send({ message: 'Despesa not found' });
        }
    };
}

export const despesaController = new DespesaController();
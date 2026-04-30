import type { FastifyRequest, FastifyReply } from 'fastify';
import { ObjetivoFinanceiroRepository } from '../repositories/ObjetivoFinanceiroRepository.js';
import type { ObjetivoFinanceiro } from '../../generated/prisma/client.js';

export class ObjetivoFinanceiroController {
    private repository = new ObjetivoFinanceiroRepository();

    post = async (
        request: FastifyRequest<{ Body: Omit<ObjetivoFinanceiro, 'id'> }>,
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
        json ? reply.send(json) : reply.status(404).send({ message: 'Not found' });
    };

    putParamId = async (
        request: FastifyRequest<{ Params: { id: string }, Body: Omit<ObjetivoFinanceiro, 'id'> }>,
        reply: FastifyReply
    ) => {
        try {
            const json = await this.repository.update(Number(request.params.id), request.body);
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Not found' });
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
            reply.status(404).send({ message: 'Not found' });
        }
    };
}

export const objetivoFinanceiroController = new ObjetivoFinanceiroController();
import type { FastifyRequest, FastifyReply } from 'fastify';
import { RelatorioMensalRepository } from '../repositories/RelatorioMensalRepository.js';
import type { RelatorioMensal } from '../../generated/prisma/client.js';

export class RelatorioMensalController {
    private repository = new RelatorioMensalRepository();

    post = async (
        request: FastifyRequest<{ Body: Omit<RelatorioMensal, 'id'> }>,
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
        json ? reply.status(200).send(json) : reply.status(404).send({ message: 'Relatorio not found' });
    };

    putParamId = async (
        request: FastifyRequest<{ Params: { id: string }, Body: Omit<RelatorioMensal, 'id'> }>,
        reply: FastifyReply
    ) => {
        try {
            const json = await this.repository.update(Number(request.params.id), request.body);
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Relatorio not found' });
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
            reply.status(404).send({ message: 'Relatorio not found' });
        }
    };
}

export const relatorioMensalController = new RelatorioMensalController();
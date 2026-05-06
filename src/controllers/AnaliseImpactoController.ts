import type { FastifyRequest, FastifyReply } from 'fastify';
import { AnaliseImpactoRepository } from '../repositories/AnaliseImpactoRepository.js';
import type { AnaliseImpacto } from '../../generated/prisma/client.js';

export class AnaliseImpactoController {
    private repository = new AnaliseImpactoRepository();

    post = async (
        request: FastifyRequest<{ Body: Omit<AnaliseImpacto, 'id'> }>,
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
        json ? reply.status(200).send(json) : reply.status(404).send({ message: 'Analise de Impacto not found' });
    };

    putParamId = async (
        request: FastifyRequest<{ Params: { id: string }, Body: Omit<AnaliseImpacto, 'id'> }>,
        reply: FastifyReply
    ) => {
        try {
            const json = await this.repository.update(Number(request.params.id), request.body);
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Analise de Impacto not found' });
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
            reply.status(404).send({ message: 'Analise de Impacto not found' });
        }
    };
}

export const analiseImpactoController = new AnaliseImpactoController();
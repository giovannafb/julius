import type { FastifyRequest, FastifyReply } from 'fastify';
import { AnaliseImpactoObjetivoRepository } from '../repositories/AnaliseImpactoObjetivoRepository.js';
import type { AnaliseImpactoObjetivo } from '../../generated/prisma/client.js';

export class AnaliseImpactoObjetivoController {
    private repository = new AnaliseImpactoObjetivoRepository();

    post = async (
        request: FastifyRequest<{ Body: AnaliseImpactoObjetivo }>,
        reply: FastifyReply
    ) => {
        const json = await this.repository.create(request.body);
        reply.status(201).send(json);
    };

    get = async (_: FastifyRequest, reply: FastifyReply) => {
        const json = await this.repository.findAll();
        reply.status(200).send(json);
    };

    getParamIds = async (
        request: FastifyRequest<{ Params: { analiseId: string, objetivoId: string } }>,
        reply: FastifyReply
    ) => {
        const json = await this.repository.findById(
            Number(request.params.analiseId), 
            Number(request.params.objetivoId)
        );
        json ? reply.status(200).send(json) : reply.status(404).send({ message: 'Relation not found' });
    };

    deleteParamIds = async (
        request: FastifyRequest<{ Params: { analiseId: string, objetivoId: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const json = await this.repository.delete(
                Number(request.params.analiseId), 
                Number(request.params.objetivoId)
            );
            reply.send(json);
        } catch {
            reply.status(404).send({ message: 'Relation not found' });
        }
    };
}

export const analiseImpactoObjetivoController = new AnaliseImpactoObjetivoController();
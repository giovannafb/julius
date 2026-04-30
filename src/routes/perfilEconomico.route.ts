import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { perfilEconomicoController } from '../controllers/PerfilEconomicoController.js';
import {
    getPerfilSchema,
    getPerfilByIdSchema,
    postPerfilSchema,
    putPerfilSchema,
    deletePerfilSchema
} from '../schemas/perfilEconomico.schema.js';

type IdParams = { Params: { id: string } };

async function perfilEconomicoRoutes(fastify: FastifyInstance) {
    fastify.get('/', getPerfilSchema, perfilEconomicoController.get);

    fastify.get('/:id', getPerfilByIdSchema, perfilEconomicoController.getParamId);

    fastify.post('/', postPerfilSchema, perfilEconomicoController.post);

    fastify.put('/:id', putPerfilSchema, perfilEconomicoController.putParamId);

    fastify.delete('/:id', deletePerfilSchema, perfilEconomicoController.deleteParamId);
}

export default perfilEconomicoRoutes;
import type { FastifyInstance } from 'fastify';
import { historicoController } from '../controllers/HistoricoController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
    getHistoricoSchema,
    getHistoricoByIdSchema,
    postHistoricoSchema,
    putHistoricoSchema,
    deleteHistoricoSchema
} from '../schemas/historico.schema.js';

async function historicoRoutes(fastify: FastifyInstance) {
  // Protege todas as rotas de histórico com o middleware de JWT

  fastify.get('/', getHistoricoSchema, historicoController.get);
  fastify.get('/:id', getHistoricoByIdSchema, historicoController.getParamId);
  fastify.post('/', postHistoricoSchema, historicoController.post);
  fastify.put('/:id', putHistoricoSchema, historicoController.putParamId);
  fastify.delete('/:id', deleteHistoricoSchema, historicoController.deleteParamId);
}

export default historicoRoutes;
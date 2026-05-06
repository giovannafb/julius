import type { FastifyInstance } from 'fastify';
import { relatorioMensalController } from '../controllers/RelatorioMensalController.js';
import {
    getRelatorioSchema,
    getRelatorioByIdSchema,
    postRelatorioSchema,
    putRelatorioSchema,
    deleteRelatorioSchema
} from '../schemas/relatorioMensal.schema.js';

async function relatorioMensalRoutes(fastify: FastifyInstance) {
  // preHandler removido conforme solicitado
  
  fastify.get('/', getRelatorioSchema, relatorioMensalController.get);
  fastify.get('/:id', getRelatorioByIdSchema, relatorioMensalController.getParamId);
  fastify.post('/', postRelatorioSchema, relatorioMensalController.post);
  fastify.put('/:id', putRelatorioSchema, relatorioMensalController.putParamId);
  fastify.delete('/:id', deleteRelatorioSchema, relatorioMensalController.deleteParamId);
}

export default relatorioMensalRoutes;
import type { FastifyInstance } from 'fastify';
import { receitaController } from '../controllers/ReceitaController.js';
import {
    getReceitaSchema,
    getReceitaByIdSchema,
    postReceitaSchema,
    putReceitaSchema,
    deleteReceitaSchema
} from '../schemas/receita.schema.js';

async function receitaRoutes(fastify: FastifyInstance) {
  fastify.get('/', getReceitaSchema, receitaController.get);
  fastify.get('/:id', getReceitaByIdSchema, receitaController.getParamId);
  fastify.post('/', postReceitaSchema, receitaController.post);
  fastify.put('/:id', putReceitaSchema, receitaController.putParamId);
  fastify.delete('/:id', deleteReceitaSchema, receitaController.deleteParamId);
}

export default receitaRoutes;
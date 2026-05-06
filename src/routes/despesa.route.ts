import type { FastifyInstance } from 'fastify';
import { despesaController } from '../controllers/DespesaController.js';
import {
    getDespesaSchema,
    getDespesaByIdSchema,
    postDespesaSchema,
    putDespesaSchema,
    deleteDespesaSchema
} from '../schemas/despesa.schema.js';

async function despesaRoutes(fastify: FastifyInstance) {
  fastify.get('/', getDespesaSchema, despesaController.get);
  fastify.get('/:id', getDespesaByIdSchema, despesaController.getParamId);
  fastify.post('/', postDespesaSchema, despesaController.post);
  fastify.put('/:id', putDespesaSchema, despesaController.putParamId);
  fastify.delete('/:id', deleteDespesaSchema, despesaController.deleteParamId);
}

export default despesaRoutes;
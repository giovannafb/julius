import type { FastifyInstance } from 'fastify';
import { analiseImpactoController } from '../controllers/AnaliseImpactoController.js';
import {
    getAnaliseImpactoSchema,
    getAnaliseImpactoByIdSchema,
    postAnaliseImpactoSchema,
    putAnaliseImpactoSchema,
    deleteAnaliseImpactoSchema
} from '../schemas/analiseImpacto.schema.js';

async function analiseImpactoRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAnaliseImpactoSchema, analiseImpactoController.get);
  fastify.get('/:id', getAnaliseImpactoByIdSchema, analiseImpactoController.getParamId);
  fastify.post('/', postAnaliseImpactoSchema, analiseImpactoController.post);
  fastify.put('/:id', putAnaliseImpactoSchema, analiseImpactoController.putParamId);
  fastify.delete('/:id', deleteAnaliseImpactoSchema, analiseImpactoController.deleteParamId);
}

export default analiseImpactoRoutes;
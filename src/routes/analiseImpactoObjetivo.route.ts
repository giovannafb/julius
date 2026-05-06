import type { FastifyInstance } from 'fastify';
import { analiseImpactoObjetivoController } from '../controllers/AnaliseImpactoObjetivoController.js';
import {
    getAnaliseObjetivoSchema,
    postAnaliseObjetivoSchema,
    deleteAnaliseObjetivoSchema
} from '../schemas/analiseImpactoObjetivo.schema.js';

async function analiseImpactoObjetivoRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAnaliseObjetivoSchema, analiseImpactoObjetivoController.get);
  fastify.post('/', postAnaliseObjetivoSchema, analiseImpactoObjetivoController.post);
  // Rota com dois parâmetros para identificar a chave composta
  fastify.delete('/:analiseId/:objetivoId', deleteAnaliseObjetivoSchema, analiseImpactoObjetivoController.deleteParamIds);
}

export default analiseImpactoObjetivoRoutes;
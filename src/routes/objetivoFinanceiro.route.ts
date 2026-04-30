import type { FastifyInstance } from "fastify";
import { objetivoFinanceiroController } from "../controllers/ObjetivoFinanceiroController.js";
import {
  getObjetivoSchema,
  getObjetivoByIdSchema,
  postObjetivoSchema,
  putObjetivoSchema,
  deleteObjetivoSchema
} from "../schemas/objetivoFinanceiro.schema.js";

async function objetivoFinanceiroRoutes(fastify: FastifyInstance){
    fastify.get('/', getObjetivoSchema, objetivoFinanceiroController.get);
    fastify.get('/:id', getObjetivoByIdSchema, objetivoFinanceiroController.getParamId);
    fastify.post('/', postObjetivoSchema, objetivoFinanceiroController.post);
    fastify.put('/:id', putObjetivoSchema, objetivoFinanceiroController.putParamId);
    fastify.delete('/:id', deleteObjetivoSchema, objetivoFinanceiroController.deleteParamId);
}

export default objetivoFinanceiroRoutes;
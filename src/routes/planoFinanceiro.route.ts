import type { FastifyInstance } from "fastify";
import { planoFinanceiroController } from "../controllers/PlanoFinanceiroController.js";
import {
  getPlanoSchema,
  getPlanoByIdSchema,
  postPlanoSchema,
  putPlanoSchema,
  deletePlanoSchema
} from "../schemas/planoFinanceiro.schema.js";

async function planoFinanceiroRoutes(fastify: FastifyInstance){
    fastify.get('/', getPlanoSchema, planoFinanceiroController.get);
    fastify.get('/:id', getPlanoByIdSchema, planoFinanceiroController.getParamId);
    fastify.post('/', postPlanoSchema, planoFinanceiroController.post);
    fastify.put('/:id', putPlanoSchema, planoFinanceiroController.putParamId);
    fastify.delete('/:id', deletePlanoSchema, planoFinanceiroController.deleteParamId);
}

export default planoFinanceiroRoutes;
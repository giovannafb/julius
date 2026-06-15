import type { FastifyInstance } from "fastify";
import { transacaoController } from "../controllers/TransacaoController.js";
import {
  getTransacaoSchema,
  getTransacaoByIdSchema,
  postTransacaoSchema,
  putTransacaoSchema,
  deleteTransacaoSchema
} from "../schemas/transacao.schema.js";

async function transacaoRoutes(fastify: FastifyInstance){
    fastify.get('/', getTransacaoSchema, transacaoController.get);
    fastify.get('/:id', getTransacaoByIdSchema, transacaoController.getParamId);
    fastify.put('/:id', putTransacaoSchema, transacaoController.putParamId);
    fastify.delete('/:id', deleteTransacaoSchema, transacaoController.deleteParamId);
}

export default transacaoRoutes;
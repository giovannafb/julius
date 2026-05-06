import type { FastifyInstance } from 'fastify';
import { notificacaoController } from '../controllers/NotificacaoController.js';
import {
    getNotificacaoSchema,
    getNotificacaoByIdSchema,
    postNotificacaoSchema,
    putNotificacaoSchema,
    deleteNotificacaoSchema
} from '../schemas/notificacao.schema.js';

async function notificacaoRoutes(fastify: FastifyInstance) {
  fastify.get('/', getNotificacaoSchema, notificacaoController.get);
  fastify.get('/:id', getNotificacaoByIdSchema, notificacaoController.getParamId);
  fastify.post('/', postNotificacaoSchema, notificacaoController.post);
  fastify.put('/:id', putNotificacaoSchema, notificacaoController.putParamId);
  fastify.delete('/:id', deleteNotificacaoSchema, notificacaoController.deleteParamId);
}

export default notificacaoRoutes;
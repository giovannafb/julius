import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { usuarioController } from '../controllers/UsuarioController.js';
import {
    getUsuarioSchema,
    getUsuarioByIdSchema,
    postUsuarioSchema,
    putUsuarioSchema,
    deleteUsuarioSchema
} from '../schemas/usuario.schema.js';

async function usuarioRoutes(fastify: FastifyInstance) {
  fastify.get('/', getUsuarioSchema, usuarioController.get);
  fastify.get('/:id', getUsuarioByIdSchema, usuarioController.getParamId);
  fastify.post('/', postUsuarioSchema, usuarioController.post);
  fastify.put('/:id', putUsuarioSchema, usuarioController.putParamId);
  fastify.delete('/:id', deleteUsuarioSchema, usuarioController.deleteParamId);
}

export default usuarioRoutes;
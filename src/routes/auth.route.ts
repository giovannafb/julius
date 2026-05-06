import type { FastifyInstance } from 'fastify';
import { loginController } from '../controllers/auth.controller.js';
import { getAuthSchema } from '../schemas/auth.schema.js';
async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/login', getAuthSchema, loginController);
}
export default authRoutes;
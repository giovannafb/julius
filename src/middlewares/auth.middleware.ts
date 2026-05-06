import jwt from 'jsonwebtoken';
import type { FastifyRequest, FastifyReply } from 'fastify';
export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        reply.status(401).send({ message: 'Token ausente' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        reply.status(401).send({ message: 'Token ausente' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        (request as any).user = decoded;
    } catch {
        reply.status(401).send({ message: 'Token inválido' });
    }
}
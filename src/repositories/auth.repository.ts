import { prisma } from '../../lib/prisma.js';
export const findUsuarioByLogin = async (login: string) => {
    return prisma.usuario.findUnique({ where: { login } });
};
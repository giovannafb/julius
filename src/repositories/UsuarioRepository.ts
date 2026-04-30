import { prisma } from '../../lib/prisma.js'
import type { Usuario } from '../../generated/prisma/client.js';

export class UsuarioRepository {
    public async findAll(): Promise<Usuario[]> {
        return prisma.usuario.findMany();
    }

    public async findById(id: number): Promise<Usuario | null> {
        return prisma.usuario.findUnique({ where: { id } });
    }

    public async create(data: Omit<Usuario, 'id'>): Promise<Usuario> {
        return prisma.usuario.create({ data });
    }

    public async update(id: number, data: Partial<Omit<Usuario, 'id'>>): Promise<Usuario> {
        return prisma.usuario.update({ where: { id }, data });
    }

    public async delete(id: number): Promise<Usuario> {
        return prisma.usuario.delete({ where: { id } });
    }
}
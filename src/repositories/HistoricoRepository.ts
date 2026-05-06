import { prisma } from '../../lib/prisma.js'
import type { Historico } from '../../generated/prisma/client.js';

export class HistoricoRepository {
    public async findAll(): Promise<Historico[]> {
        return prisma.historico.findMany({
            include: { transacoes: true } // Opcional: traz as transações junto
        });
    }

    public async findById(id: number): Promise<Historico | null> {
        return prisma.historico.findUnique({ 
            where: { id },
            include: { transacoes: true, perfilEconomico: true }
        });
    }

    public async create(data: Omit<Historico, 'id'>): Promise<Historico> {
        return prisma.historico.create({ data });
    }

    public async update(id: number, data: Partial<Omit<Historico, 'id'>>): Promise<Historico> {
        return prisma.historico.update({ where: { id }, data });
    }

    public async delete(id: number): Promise<Historico> {
        return prisma.historico.delete({ where: { id } });
    }
}
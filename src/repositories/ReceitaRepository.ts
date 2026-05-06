import { prisma } from '../../lib/prisma.js'
import type { Receita } from '../../generated/prisma/client.js';

export class ReceitaRepository {
    public async findAll(): Promise<Receita[]> {
        return prisma.receita.findMany({
            include: { transacao: true }
        });
    }

    public async findById(id: number): Promise<Receita | null> {
        return prisma.receita.findUnique({ 
            where: { transacaoId: id },
            include: { transacao: true, perfilEconomico: true }
        });
    }

    public async create(data: Receita): Promise<Receita> {
        return prisma.receita.create({ data });
    }

    public async update(id: number, data: Partial<Receita>): Promise<Receita> {
        return prisma.receita.update({ 
            where: { transacaoId: id }, 
            data 
        });
    }

    public async delete(id: number): Promise<Receita> {
        return prisma.receita.delete({ where: { transacaoId: id } });
    }
}
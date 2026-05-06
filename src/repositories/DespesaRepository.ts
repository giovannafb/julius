import { prisma } from '../../lib/prisma.js'
import type { Despesa } from '../../generated/prisma/client.js';

export class DespesaRepository {
    public async findAll(): Promise<Despesa[]> {
        return prisma.despesa.findMany({
            include: { transacao: true }
        });
    }

    public async findById(id: number): Promise<Despesa | null> {
        return prisma.despesa.findUnique({ 
            where: { transacaoId: id },
            include: { transacao: true, perfilEconomico: true }
        });
    }

    public async create(data: Despesa): Promise<Despesa> {
        return prisma.despesa.create({ data });
    }

    public async update(id: number, data: Partial<Despesa>): Promise<Despesa> {
        return prisma.despesa.update({ 
            where: { transacaoId: id }, 
            data 
        });
    }

    public async delete(id: number): Promise<Despesa> {
        return prisma.despesa.delete({ where: { transacaoId: id } });
    }
}
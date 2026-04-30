import { prisma } from '../../lib/prisma.js'
import type { PlanoFinanceiro } from '../../generated/prisma/client.js';

export class PlanoFinanceiroRepository {
    public async findAll(): Promise<PlanoFinanceiro[]> {
        return prisma.planoFinanceiro.findMany();
    }

    public async findById(id: number): Promise<PlanoFinanceiro | null> {
        return prisma.planoFinanceiro.findUnique({ where: { id } });
    }

    public async create(data: Omit<PlanoFinanceiro, 'id'>): Promise<PlanoFinanceiro> {
        return prisma.planoFinanceiro.create({ data });
    }

    public async update(id: number, data: Partial<Omit<PlanoFinanceiro, 'id'>>): Promise<PlanoFinanceiro> {
        return prisma.planoFinanceiro.update({ where: { id }, data });
    }

    public async delete(id: number): Promise<PlanoFinanceiro> {
        return prisma.planoFinanceiro.delete({ where: { id } });
    }
}
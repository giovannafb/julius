import { prisma } from '../../lib/prisma.js'
import type { ObjetivoFinanceiro } from '../../generated/prisma/client.js';

export class ObjetivoFinanceiroRepository {
    public async findAll(): Promise<ObjetivoFinanceiro[]> {
        return prisma.objetivoFinanceiro.findMany();
    }

    public async findById(id: number): Promise<ObjetivoFinanceiro | null> {
        return prisma.objetivoFinanceiro.findUnique({
            where: { id }
        });
    }

    public async create(data: Omit<ObjetivoFinanceiro, 'id'>): Promise<ObjetivoFinanceiro> {
        return prisma.objetivoFinanceiro.create({
            data
        });
    }

    public async update(id: number, data: Partial<Omit<ObjetivoFinanceiro, 'id'>>): Promise<ObjetivoFinanceiro> {
        return prisma.objetivoFinanceiro.update({
            where: { id },
            data
        });
    }

    public async delete(id: number): Promise<ObjetivoFinanceiro> {
        return prisma.objetivoFinanceiro.delete({
            where: { id }
        });
    }
}
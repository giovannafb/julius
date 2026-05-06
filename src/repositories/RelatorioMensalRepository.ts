import { prisma } from '../../lib/prisma.js'
import type { RelatorioMensal } from '../../generated/prisma/client.js';

export class RelatorioMensalRepository {
    public async findAll(): Promise<RelatorioMensal[]> {
        return prisma.relatorioMensal.findMany();
    }

    public async findById(id: number): Promise<RelatorioMensal | null> {
        return prisma.relatorioMensal.findUnique({ where: { id } });
    }

    public async create(data: Omit<RelatorioMensal, 'id'>): Promise<RelatorioMensal> {
        return prisma.relatorioMensal.create({ data });
    }

    public async update(id: number, data: Partial<Omit<RelatorioMensal, 'id'>>): Promise<RelatorioMensal> {
        return prisma.relatorioMensal.update({ where: { id }, data });
    }

    public async delete(id: number): Promise<RelatorioMensal> {
        return prisma.relatorioMensal.delete({ where: { id } });
    }
}
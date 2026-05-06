import { prisma } from '../../lib/prisma.js'
import type { AnaliseImpacto } from '../../generated/prisma/client.js';

export class AnaliseImpactoRepository {
    public async findAll(): Promise<AnaliseImpacto[]> {
        return prisma.analiseImpacto.findMany({
            include: { objetivosComprometidos: true }
        });
    }

    public async findById(id: number): Promise<AnaliseImpacto | null> {
        return prisma.analiseImpacto.findUnique({ 
            where: { id },
            include: { 
                planoFinanceiro: true, 
                transacao: true,
                objetivosComprometidos: true 
            }
        });
    }

    public async create(data: Omit<AnaliseImpacto, 'id'>): Promise<AnaliseImpacto> {
        return prisma.analiseImpacto.create({ data });
    }

    public async update(id: number, data: Partial<Omit<AnaliseImpacto, 'id'>>): Promise<AnaliseImpacto> {
        return prisma.analiseImpacto.update({ where: { id }, data });
    }

    public async delete(id: number): Promise<AnaliseImpacto> {
        return prisma.analiseImpacto.delete({ where: { id } });
    }
}
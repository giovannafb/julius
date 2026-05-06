import { prisma } from '../../lib/prisma.js'
import type { AnaliseImpactoObjetivo } from '../../generated/prisma/client.js';

export class AnaliseImpactoObjetivoRepository {
    public async findAll(): Promise<AnaliseImpactoObjetivo[]> {
        return prisma.analiseImpactoObjetivo.findMany({
            include: { analiseImpacto: true, objetivoFinanceiro: true }
        });
    }

    // Busca pela chave composta
    public async findById(analiseImpactoId: number, objetivoFinanceiroId: number): Promise<AnaliseImpactoObjetivo | null> {
        return prisma.analiseImpactoObjetivo.findUnique({ 
            where: { 
                analiseImpactoId_objetivoFinanceiroId: { 
                    analiseImpactoId, 
                    objetivoFinanceiroId 
                } 
            }
        });
    }

    public async create(data: AnaliseImpactoObjetivo): Promise<AnaliseImpactoObjetivo> {
        return prisma.analiseImpactoObjetivo.create({ data });
    }

    public async delete(analiseImpactoId: number, objetivoFinanceiroId: number): Promise<AnaliseImpactoObjetivo> {
        return prisma.analiseImpactoObjetivo.delete({ 
            where: { 
                analiseImpactoId_objetivoFinanceiroId: { 
                    analiseImpactoId, 
                    objetivoFinanceiroId 
                } 
            }
        });
    }
}
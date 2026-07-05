import { prisma } from '../../lib/prisma.js'
import type { PlanoFinanceiro } from '../../generated/prisma/client.js';

export class PlanoFinanceiroRepository {
    public async findAll(): Promise<PlanoFinanceiro[]> {
        return prisma.planoFinanceiro.findMany({ include: { objetivos: true } });
    }

    public async findById(id: number): Promise<PlanoFinanceiro | null> {
        return prisma.planoFinanceiro.findUnique({ where: { id }, include: { objetivos: true } });
    }

    public async create(data: Omit<PlanoFinanceiro, 'id'>): Promise<PlanoFinanceiro> {
        return prisma.planoFinanceiro.create({ data, include: { objetivos: true } });
    }

    public async update(id: number, data: Partial<Omit<PlanoFinanceiro, 'id'>>): Promise<PlanoFinanceiro> {
        return prisma.planoFinanceiro.update({ where: { id }, data, include: { objetivos: true } });
    }

    public async delete(id: number): Promise<PlanoFinanceiro> {
        // Primeiro, excluímos dependências para não dar erro de Foreign Key (restrição relacional)
        
        // 1. Busca Análises de Impacto relacionadas para excluir Notificações associadas
        const analises = await prisma.analiseImpacto.findMany({ where: { planoFinanceiroId: id } });
        const analiseIds = analises.map((a: any) => a.id);
        if (analiseIds.length > 0) {
            await prisma.notificacao.deleteMany({ where: { analiseImpactoId: { in: analiseIds } } });
            await prisma.analiseImpactoObjetivo.deleteMany({ where: { analiseImpactoId: { in: analiseIds } } });
        }

        const objetivos = await prisma.objetivoFinanceiro.findMany({ where: { planoFinanceiroId: id } });
        const objetivoIds = objetivos.map((o: any) => o.id);
        if (objetivoIds.length > 0) {
            await prisma.analiseImpactoObjetivo.deleteMany({ where: { objetivoFinanceiroId: { in: objetivoIds } } });
        }
        
        // 2. Exclui as Análises de Impacto
        await prisma.analiseImpacto.deleteMany({ where: { planoFinanceiroId: id } });
        
        // 3. Exclui Relatórios Mensais
        await prisma.relatorioMensal.deleteMany({ where: { planoFinanceiroId: id } });
        
        // 4. Exclui Objetivos Financeiros (que também referenciam o Plano)
        await prisma.objetivoFinanceiro.deleteMany({ where: { planoFinanceiroId: id } });

        // 5. Por fim, exclui o Plano Financeiro em si
        return prisma.planoFinanceiro.delete({ where: { id } });
    }
}
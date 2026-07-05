import { prisma } from '../../lib/prisma.js'
import type { AnaliseImpacto } from '../../generated/prisma/client.js';

export class AnaliseImpactoRepository {
    public async findAll(): Promise<AnaliseImpacto[]> {
        return prisma.analiseImpacto.findMany({
            include: { 
                objetivoOrigem: true,
                objetivosComprometidos: {
                    include: { objetivoFinanceiro: true }
                } 
            }
        });
    }

    public async findById(id: number): Promise<AnaliseImpacto | null> {
        return prisma.analiseImpacto.findUnique({ 
            where: { id },
            include: { 
                planoFinanceiro: true, 
                transacao: true,
                objetivoOrigem: true,
                objetivosComprometidos: {
                    include: { objetivoFinanceiro: true }
                } 
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
        // Excluir as ligações da tabela N:M
        await prisma.analiseImpactoObjetivo.deleteMany({ where: { analiseImpactoId: id } });

        // Excluir notificação caso exista
        const notificacao = await prisma.notificacao.findUnique({ where: { analiseImpactoId: id } });
        if (notificacao) {
            await prisma.notificacao.delete({ where: { id: notificacao.id } });
        }

        // Excluir a análise
        return prisma.analiseImpacto.delete({ where: { id } });
    }
}
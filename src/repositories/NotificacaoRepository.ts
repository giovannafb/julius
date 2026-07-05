import { prisma } from '../../lib/prisma.js'
import type { Notificacao } from '../../generated/prisma/client.js';

export class NotificacaoRepository {
    public async findAll(): Promise<Notificacao[]> {
        return prisma.notificacao.findMany({
            include: {
                analiseImpacto: {
                    include: {
                        planoFinanceiro: true
                    }
                }
            }
        });
    }

    public async findById(id: number): Promise<Notificacao | null> {
        return prisma.notificacao.findUnique({ 
            where: { id },
            include: { analiseImpacto: true }
        });
    }

    public async create(data: Omit<Notificacao, 'id'>): Promise<Notificacao> {
        return prisma.notificacao.create({ data });
    }

    public async update(id: number, data: Partial<Omit<Notificacao, 'id'>>): Promise<Notificacao> {
        return prisma.notificacao.update({ where: { id }, data });
    }

    public async delete(id: number): Promise<Notificacao> {
        return prisma.notificacao.delete({ where: { id } });
    }
}
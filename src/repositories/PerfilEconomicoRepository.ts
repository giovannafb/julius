import { prisma } from '../../lib/prisma.js'
import type { PerfilEconomico } from '../../generated/prisma/client.js';

export class PerfilEconomicoRepository {
    public async findAll(): Promise<PerfilEconomico[]> {
        return prisma.perfilEconomico.findMany();
    }

    public async findById(id: number): Promise<PerfilEconomico | null> {
        return prisma.perfilEconomico.findUnique({ where: { id } });
    }

    public async create(data: Omit<PerfilEconomico, 'id'>): Promise<PerfilEconomico> {
        return prisma.perfilEconomico.create({ data });
    }

    public async update(id: number, data: Partial<Omit<PerfilEconomico, 'id'>>): Promise<PerfilEconomico> {
        return prisma.perfilEconomico.update({ where: { id }, data });
    }

    public async delete(id: number): Promise<PerfilEconomico> {
        return prisma.perfilEconomico.delete({ where: { id } });
    }

    public async findByUsuarioIdWithDetails(usuarioId: number) {
        const umMesAtras = new Date();
        umMesAtras.setMonth(umMesAtras.getMonth() - 1);

        return prisma.perfilEconomico.findUnique({
            where: { usuarioId },
            include: {
                receitasFixas: {
                    include: { transacao: true }
                },
                despesasFixas: {
                    include: { transacao: true }
                },
                historico: {
                    include: {
                        transacoes: {
                            where: {
                                data: {
                                    gte: umMesAtras
                                }
                            },
                            orderBy: {
                                data: 'desc'
                            }
                        }
                    }
                }
            }
        });
    }
}
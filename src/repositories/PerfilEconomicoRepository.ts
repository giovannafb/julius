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
                            orderBy: {
                                data: 'desc'
                            }
                        }
                    }
                }
            }
        });
    }

    public async atualizarSaldo(id: number): Promise<void> {
        const historico = await prisma.historico.findUnique({
            where: { perfilEconomicoId: id },
            include: { transacoes: true }
        });
        
        let saldo = 0;
        if (historico && historico.transacoes) {
            saldo = historico.transacoes.reduce((acc, t) => {
                return t.tipo === 'RECEITA' ? acc + t.valor : acc - t.valor;
            }, 0);
        }

        await prisma.perfilEconomico.update({
            where: { id },
            data: { saldo, status: saldo >= 0 }
        });
    }
}
import { prisma } from '../../lib/prisma.js'
import type { Despesa } from '../../generated/prisma/client.js';

export class DespesaRepository {
    public async findAll(): Promise<Despesa[]> {
        return prisma.despesa.findMany({
            include: { transacao: true }
        });
    }

    public async findById(id: number): Promise<Despesa | null> {
        return prisma.despesa.findUnique({ 
            where: { transacaoId: id },
            include: { transacao: true, perfilEconomico: true }
        });
    }

    public async create(data: any): Promise<Despesa> {
        const payload: any = {
            transacao: {
                create: {
                    descricao: data.descricao,
                    valor: data.valor,
                    data: new Date(data.data),
                    tipo: 'DESPESA',
                    periodicidade: data.periodicidade
                }
            }
        };
        if (data.perfilEconomicoId) {
            payload.perfilEconomico = { connect: { id: data.perfilEconomicoId } };
        }
        return prisma.despesa.create({
            data: payload,
            include: { transacao: true }
        });
    }

    public async update(id: number, data: any): Promise<Despesa> {
        const payload: any = {};
        if (data.perfilEconomicoId !== undefined) {
            payload.perfilEconomico = { connect: { id: data.perfilEconomicoId } };
        }

        const transacaoUpdate: any = {};
        if (data.descricao !== undefined) transacaoUpdate.descricao = data.descricao;
        if (data.valor !== undefined) transacaoUpdate.valor = data.valor;
        if (data.data !== undefined) transacaoUpdate.data = new Date(data.data);
        if (data.periodicidade !== undefined) transacaoUpdate.periodicidade = data.periodicidade;
        
        if (Object.keys(transacaoUpdate).length > 0) {
            payload.transacao = { update: transacaoUpdate };
        }

        return prisma.despesa.update({ 
            where: { transacaoId: id }, 
            data: payload,
            include: { transacao: true }
        });
    }

    public async delete(id: number): Promise<Despesa> {
        return prisma.despesa.delete({ where: { transacaoId: id } });
    }
}
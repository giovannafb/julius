import { prisma } from '../../lib/prisma.js'
import type { Receita } from '../../generated/prisma/client.js';

export class ReceitaRepository {
    public async findAll(): Promise<Receita[]> {
        return prisma.receita.findMany({
            include: { transacao: true }
        });
    }

    public async findById(id: number): Promise<Receita | null> {
        return prisma.receita.findUnique({ 
            where: { transacaoId: id },
            include: { transacao: true, perfilEconomico: true }
        });
    }

    public async create(data: any): Promise<Receita> {
        const payload: any = {
            fonte: data.fonte,
            transacao: {
                create: {
                    descricao: data.descricao,
                    valor: data.valor,
                    data: new Date(data.data),
                    tipo: 'RECEITA',
                    periodicidade: data.periodicidade
                }
            }
        };
        if (data.perfilEconomicoId) {
            payload.perfilEconomico = { connect: { id: data.perfilEconomicoId } };
        }
        return prisma.receita.create({
            data: payload,
            include: { transacao: true }
        });
    }

    public async update(id: number, data: any): Promise<Receita> {
        const payload: any = {};
        if (data.fonte !== undefined) payload.fonte = data.fonte;
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

        return prisma.receita.update({ 
            where: { transacaoId: id }, 
            data: payload,
            include: { transacao: true }
        });
    }

    public async delete(id: number): Promise<Receita> {
        return prisma.receita.delete({ where: { transacaoId: id } });
    }
}
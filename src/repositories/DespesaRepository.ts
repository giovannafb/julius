import { prisma } from '../../lib/prisma.js'
import type { Despesa } from '../../generated/prisma/client.js';
import { PerfilEconomicoRepository } from './PerfilEconomicoRepository.js';

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
            payload.transacao.create.historico = { connect: { perfilEconomicoId: data.perfilEconomicoId } };
        }
        const result = await prisma.despesa.create({
            data: payload,
            include: { transacao: true }
        });
        
        if (data.perfilEconomicoId) {
            await new PerfilEconomicoRepository().atualizarSaldo(data.perfilEconomicoId);
        }
        
        return result;
    }

    public async update(id: number, data: any): Promise<Despesa> {
        const payload: any = {};
        const transacaoUpdate: any = {};
        if (data.perfilEconomicoId !== undefined) {
            payload.perfilEconomico = { connect: { id: data.perfilEconomicoId } };
            transacaoUpdate.historico = { connect: { perfilEconomicoId: data.perfilEconomicoId } };
        }
        if (data.descricao !== undefined) transacaoUpdate.descricao = data.descricao;
        if (data.valor !== undefined) transacaoUpdate.valor = data.valor;
        if (data.data !== undefined) transacaoUpdate.data = new Date(data.data);
        if (data.periodicidade !== undefined) transacaoUpdate.periodicidade = data.periodicidade;
        
        if (Object.keys(transacaoUpdate).length > 0) {
            payload.transacao = { update: transacaoUpdate };
        }

        const result = await prisma.despesa.update({ 
            where: { transacaoId: id }, 
            data: payload,
            include: { transacao: true }
        });
        
        if (result.perfilEconomicoId) {
            await new PerfilEconomicoRepository().atualizarSaldo(result.perfilEconomicoId);
        }
        
        return result;
    }

    public async delete(id: number): Promise<Despesa> {
        const result = await prisma.despesa.delete({ where: { transacaoId: id } });
        
        if (result.perfilEconomicoId) {
            await new PerfilEconomicoRepository().atualizarSaldo(result.perfilEconomicoId);
        }
        
        return result;
    }
}
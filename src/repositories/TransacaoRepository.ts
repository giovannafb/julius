import { prisma } from '../../lib/prisma.js'
import type { Transacao } from '../../generated/prisma/client.js';

export class TransacaoRepository {
    public async findAll(): Promise<Transacao[]> {
        return prisma.transacao.findMany();
    }
    public async findById(id: number): Promise<Transacao | null> {
        return prisma.transacao.findUnique({ where: { id: id } });
    }
    public async create(data: Omit<Transacao, 'id'>): Promise<Transacao> {
        return prisma.transacao.create({ data });
    }
    public async update(id: number, data: Partial<Omit<Transacao, 'id'>>): Promise<Transacao> {
        return prisma.transacao.update({ where: { id: id }, data });
    }
    public async delete(id: number): Promise<Transacao> {
        return prisma.transacao.delete({ where: { id: id } });
    }

}
import { prisma } from '../../lib/prisma.js'
import type { Transacao } from '../../generated/prisma/client.js';
import { PerfilEconomicoRepository } from './PerfilEconomicoRepository.js';

export class TransacaoRepository {
    private async updateSaldo(historicoId: number | null | undefined) {
        if (!historicoId) return;
        const historico = await prisma.historico.findUnique({ where: { id: historicoId } });
        if (historico?.perfilEconomicoId) {
            await new PerfilEconomicoRepository().atualizarSaldo(historico.perfilEconomicoId);
        }
    }

    public async findAll(): Promise<Transacao[]> {
        return prisma.transacao.findMany();
    }
    public async findById(id: number): Promise<Transacao | null> {
        return prisma.transacao.findUnique({ where: { id: id } });
    }
    public async create(data: Omit<Transacao, 'id'>): Promise<Transacao> {
        const result = await prisma.transacao.create({ data });
        await this.updateSaldo(result.historicoId);
        return result;
    }
    public async update(id: number, data: Partial<Omit<Transacao, 'id'>>): Promise<Transacao> {
        const result = await prisma.transacao.update({ where: { id: id }, data });
        await this.updateSaldo(result.historicoId);
        return result;
    }
    public async delete(id: number): Promise<Transacao> {
        const result = await prisma.transacao.delete({ where: { id: id } });
        await this.updateSaldo(result.historicoId);
        return result;
    }

}
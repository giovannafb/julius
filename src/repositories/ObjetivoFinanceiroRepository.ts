import { prisma } from '../../lib/prisma.js'
import type { ObjetivoFinanceiro } from '../../generated/prisma/client.js';

export class ObjetivoFinanceiroRepository {
    public async findAll(): Promise<ObjetivoFinanceiro[]> {
        return prisma.objetivoFinanceiro.findMany();
    }

    public async findById(id: number): Promise<ObjetivoFinanceiro | null> {
        return prisma.objetivoFinanceiro.findUnique({
            where: { id }
        });
    }

    public async create(data: Omit<ObjetivoFinanceiro, 'id'>): Promise<ObjetivoFinanceiro> {
        const novoObjetivo = await prisma.objetivoFinanceiro.create({ data });

        // Lógica de Análise de Impacto
        try {
            const plano = await prisma.planoFinanceiro.findUnique({ where: { id: novoObjetivo.planoFinanceiroId } });
            if (plano) {
                const perfil = await prisma.perfilEconomico.findUnique({
                    where: { usuarioId: plano.usuarioId },
                    include: {
                        receitasFixas: { include: { transacao: true } },
                        despesasFixas: { include: { transacao: true } }
                    }
                });

                if (perfil) {
                    const todosObjetivosPendentes = await prisma.objetivoFinanceiro.findMany({
                        where: { planoFinanceiroId: plano.id, status: 'PENDENTE' }
                    });

                    const objetivosComprometidos: number[] = [];

                    for (const obj of todosObjetivosPendentes) {
                        if (obj.id === novoObjetivo.id) continue; // Avaliamos os outros
                        
                        const dataPrazo = new Date(obj.prazo);
                        
                        const receitasAtePrazo = perfil.receitasFixas
                            .filter(r => new Date(r.transacao.data) <= dataPrazo)
                            .reduce((sum, r) => sum + r.transacao.valor, 0);
                            
                        const despesasAtePrazo = perfil.despesasFixas
                            .filter(d => new Date(d.transacao.data) <= dataPrazo)
                            .reduce((sum, d) => sum + d.transacao.valor, 0);

                        // Somamos o custo de todos os objetivos até essa data, INCLUINDO o novo objetivo
                        const custoObjetivosAtePrazo = todosObjetivosPendentes
                            .filter(o => new Date(o.prazo) <= dataPrazo)
                            .reduce((sum, o) => sum + o.valor, 0);

                        const saldoProjetado = perfil.saldo + receitasAtePrazo - despesasAtePrazo;
                        
                        if (saldoProjetado - custoObjetivosAtePrazo < 0) {
                            objetivosComprometidos.push(obj.id);
                        }
                    }

                    if (objetivosComprometidos.length > 0) {
                        const analise = await prisma.analiseImpacto.create({
                            data: {
                                dataAnalise: new Date(),
                                comprometeObjetivos: true,
                                planoFinanceiroId: plano.id,
                                objetivoOrigemId: novoObjetivo.id
                            }
                        });

                        const relacoes = objetivosComprometidos.map(id => ({
                            analiseImpactoId: analise.id,
                            objetivoFinanceiroId: id
                        }));

                        await prisma.analiseImpactoObjetivo.createMany({ data: relacoes });

                        const nomesComprometidos = todosObjetivosPendentes
                            .filter(o => objetivosComprometidos.includes(o.id))
                            .map(o => o.nome)
                            .join(', ');

                        await prisma.notificacao.create({
                            data: {
                                mensagem: `O novo objetivo '${novoObjetivo.nome}' compromete os seguintes objetivos: ${nomesComprometidos}.`,
                                tipo: 'ALERTA',
                                dataEnvio: new Date(),
                                analiseImpactoId: analise.id
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao processar análise de impacto:", error);
        }

        return novoObjetivo;
    }

    public async update(id: number, data: Partial<Omit<ObjetivoFinanceiro, 'id'>>): Promise<ObjetivoFinanceiro> {
        return prisma.objetivoFinanceiro.update({
            where: { id },
            data
        });
    }

    public async delete(id: number): Promise<ObjetivoFinanceiro> {
        const objetivo = await prisma.objetivoFinanceiro.findUnique({ where: { id } });
        if (!objetivo) throw new Error("Objective not found");
        const planoFinanceiroId = objetivo.planoFinanceiroId;

        // Limpar relações de objetivos comprometidos
        await prisma.analiseImpactoObjetivo.deleteMany({
            where: { objetivoFinanceiroId: id }
        });

        // Se este objetivo causou alguma análise, excluí-la (pois o motivo sumiu)
        const analisesOrigem = await prisma.analiseImpacto.findMany({
            where: { objetivoOrigemId: id },
            include: { notificacao: true }
        });

        for (const a of analisesOrigem) {
            if (a.notificacao) await prisma.notificacao.delete({ where: { id: a.notificacao.id } });
            await prisma.analiseImpactoObjetivo.deleteMany({ where: { analiseImpactoId: a.id } });
            await prisma.analiseImpacto.delete({ where: { id: a.id } });
        }

        // Excluir o objetivo
        const deletedObj = await prisma.objetivoFinanceiro.delete({ where: { id } });

        // Recalcular as Análises de Impacto restantes para este Plano
        try {
            const plano = await prisma.planoFinanceiro.findUnique({ where: { id: planoFinanceiroId } });
            if (plano) {
                const perfil = await prisma.perfilEconomico.findUnique({
                    where: { usuarioId: plano.usuarioId },
                    include: { receitasFixas: { include: { transacao: true } }, despesasFixas: { include: { transacao: true } } }
                });

                if (perfil) {
                    const analisesRestantes = await prisma.analiseImpacto.findMany({
                        where: { planoFinanceiroId },
                        include: { objetivoOrigem: true, notificacao: true }
                    });

                    const todosObjetivosPendentes = await prisma.objetivoFinanceiro.findMany({
                        where: { planoFinanceiroId, status: 'PENDENTE' }
                    });

                    for (const analise of analisesRestantes) {
                        if (!analise.objetivoOrigem) continue;
                        
                        const origin = analise.objetivoOrigem;
                        const objetivosComprometidos: number[] = [];

                        for (const obj of todosObjetivosPendentes) {
                            if (obj.id === origin.id) continue;
                            
                            const dataPrazo = new Date(obj.prazo);
                            const receitasAtePrazo = perfil.receitasFixas.filter(r => new Date(r.transacao.data) <= dataPrazo).reduce((sum, r) => sum + r.transacao.valor, 0);
                            const despesasAtePrazo = perfil.despesasFixas.filter(d => new Date(d.transacao.data) <= dataPrazo).reduce((sum, d) => sum + d.transacao.valor, 0);
                            const custoObjetivosAtePrazo = todosObjetivosPendentes.filter(o => new Date(o.prazo) <= dataPrazo).reduce((sum, o) => sum + o.valor, 0);
                            const saldoProjetado = perfil.saldo + receitasAtePrazo - despesasAtePrazo;
                            
                            if (saldoProjetado - custoObjetivosAtePrazo < 0) {
                                objetivosComprometidos.push(obj.id);
                            }
                        }

                        if (objetivosComprometidos.length === 0) {
                            // Conflito resolvido! Deleta a análise
                            if (analise.notificacao) await prisma.notificacao.delete({ where: { id: analise.notificacao.id } });
                            await prisma.analiseImpactoObjetivo.deleteMany({ where: { analiseImpactoId: analise.id } });
                            await prisma.analiseImpacto.delete({ where: { id: analise.id } });
                        } else {
                            // Atualiza as relações
                            await prisma.analiseImpactoObjetivo.deleteMany({ where: { analiseImpactoId: analise.id } });
                            await prisma.analiseImpactoObjetivo.createMany({
                                data: objetivosComprometidos.map(compId => ({ analiseImpactoId: analise.id, objetivoFinanceiroId: compId }))
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao recalcular impacto:", error);
        }

        return deletedObj;
    }
}
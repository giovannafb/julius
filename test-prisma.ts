import { prisma } from './lib/prisma.js';

async function main() {
    try {
        const id = 8;
        const data = {
            descricao: "Dinheiro aleatorio",
            valor: 300,
            data: "2026-06-15T00:52:33.350Z",
            periodicidade: "UNICA",
            fonte: "Pai",
            perfilEconomicoId: 2
        };

        const payload: any = {};
        if (data.fonte !== undefined) payload.fonte = data.fonte;
        if (data.perfilEconomicoId !== undefined) payload.perfilEconomicoId = data.perfilEconomicoId;

        const transacaoUpdate: any = {};
        if (data.descricao !== undefined) transacaoUpdate.descricao = data.descricao;
        if (data.valor !== undefined) transacaoUpdate.valor = data.valor;
        if (data.data !== undefined) transacaoUpdate.data = new Date(data.data);
        if (data.periodicidade !== undefined) transacaoUpdate.periodicidade = data.periodicidade;
        
        if (Object.keys(transacaoUpdate).length > 0) {
            payload.transacao = { update: transacaoUpdate };
        }

        console.log("PAYLOAD:", JSON.stringify(payload, null, 2));

        const res = await prisma.receita.update({
            where: { transacaoId: id },
            data: payload,
            include: { transacao: true }
        });
        console.log("SUCCESS:", res);
    } catch (error) {
        console.error("ERROR:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

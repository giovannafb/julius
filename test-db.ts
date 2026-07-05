import { prisma } from './src/lib/prisma.ts';
async function main() {
  const p = await prisma.perfilEconomico.findUnique({
    where: { id: 2 },
    include: { receitasFixas: true, despesasFixas: true, historico: { include: { transacoes: true } } }
  });
  console.log(JSON.stringify(p, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());

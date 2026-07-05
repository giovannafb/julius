import { PrismaClient } from './generated/prisma/client/index.js';
const prisma = new PrismaClient();
async function main() {
  const analises = await prisma.analiseImpacto.findMany({ include: { objetivoOrigem: true, objetivosComprometidos: { include: { objetivoFinanceiro: true } } } });
  console.log(JSON.stringify(analises, null, 2));
}
main();

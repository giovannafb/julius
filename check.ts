import { PrismaClient } from './generated/prisma/client/index.js';
const prisma = new PrismaClient();
async function main() {
    const planos = await prisma.planoFinanceiro.findMany();
    console.log(JSON.stringify(planos, null, 2));
}
main().finally(() => prisma.$disconnect());

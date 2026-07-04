import { PrismaClient } from './generated/prisma/client/index.js';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.usuario.findMany();
  console.log(users);
}
main();

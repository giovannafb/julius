//carrega variáveis arquivo .env
import "dotenv/config";
//Driver do Prisma para PostgreSQL
//Adapter para node-postgres nativos JavaScript (troca daengine Rust)
import { PrismaPg } from "@prisma/adapter-pg";
//carrega classes gerada pelo Prisma do schema.prisma
import { PrismaClient } from "../generated/prisma/client";
//Resgata URL BD (.env)
const connectionString = `${process.env.DATABASE_URL}`;
//Instância o driver PostgreSQL (gerencia pool de conexões)
const adapter = new PrismaPg({ connectionString });
//Tipos TypeScript gerados automaticamente (schema.prisma)
const prisma = new PrismaClient({ adapter });
//export a instancia prima
export { prisma };
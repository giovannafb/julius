-- CreateEnum
CREATE TYPE "Periodicidade" AS ENUM ('UNICA', 'DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL');

-- CreateEnum
CREATE TYPE "StatusObjetivo" AS ENUM ('PENDENTE', 'CONCLUIDO', 'EXCLUIDO');

-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('TRANSACAO', 'RECEITA', 'DESPESA');

-- CreateEnum
CREATE TYPE "TipoNotificacao" AS ENUM ('ALERTA', 'INFO', 'AVISO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilEconomico" (
    "id" SERIAL NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "PerfilEconomico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historico" (
    "id" SERIAL NOT NULL,
    "perfilEconomicoId" INTEGER NOT NULL,

    CONSTRAINT "Historico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanoFinanceiro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "saldoAtual" DOUBLE PRECISION NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL,
    "economiaMensalNecessaria" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "PlanoFinanceiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjetivoFinanceiro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "prazo" TIMESTAMP(3) NOT NULL,
    "prioridade" INTEGER NOT NULL,
    "status" "StatusObjetivo" NOT NULL DEFAULT 'PENDENTE',
    "planoFinanceiroId" INTEGER NOT NULL,

    CONSTRAINT "ObjetivoFinanceiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatorioMensal" (
    "id" SERIAL NOT NULL,
    "mes" TEXT NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL,
    "totalDespesas" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReceita" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saldoFinal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conclusaoObjetivos" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planoFinanceiroId" INTEGER NOT NULL,

    CONSTRAINT "RelatorioMensal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnaliseImpacto" (
    "id" SERIAL NOT NULL,
    "dataAnalise" TIMESTAMP(3) NOT NULL,
    "comprometeObjetivos" BOOLEAN NOT NULL DEFAULT false,
    "planoFinanceiroId" INTEGER NOT NULL,
    "transacaoId" INTEGER NOT NULL,

    CONSTRAINT "AnaliseImpacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" SERIAL NOT NULL,
    "mensagem" TEXT NOT NULL,
    "tipo" "TipoNotificacao" NOT NULL,
    "dataEnvio" TIMESTAMP(3) NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "analiseImpactoId" INTEGER NOT NULL,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transacao" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "periodicidade" "Periodicidade" NOT NULL,
    "tipo" "TipoTransacao" NOT NULL,
    "historicoId" INTEGER,

    CONSTRAINT "Transacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receita" (
    "transacaoId" INTEGER NOT NULL,
    "fonte" TEXT NOT NULL,
    "perfilEconomicoId" INTEGER,

    CONSTRAINT "Receita_pkey" PRIMARY KEY ("transacaoId")
);

-- CreateTable
CREATE TABLE "Despesa" (
    "transacaoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "perfilEconomicoId" INTEGER,

    CONSTRAINT "Despesa_pkey" PRIMARY KEY ("transacaoId")
);

-- CreateTable
CREATE TABLE "AnaliseImpactoObjetivo" (
    "analiseImpactoId" INTEGER NOT NULL,
    "objetivoFinanceiroId" INTEGER NOT NULL,

    CONSTRAINT "AnaliseImpactoObjetivo_pkey" PRIMARY KEY ("analiseImpactoId","objetivoFinanceiroId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_login_key" ON "Usuario"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilEconomico_usuarioId_key" ON "PerfilEconomico"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Historico_perfilEconomicoId_key" ON "Historico"("perfilEconomicoId");

-- CreateIndex
CREATE UNIQUE INDEX "Notificacao_analiseImpactoId_key" ON "Notificacao"("analiseImpactoId");

-- AddForeignKey
ALTER TABLE "PerfilEconomico" ADD CONSTRAINT "PerfilEconomico_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico" ADD CONSTRAINT "Historico_perfilEconomicoId_fkey" FOREIGN KEY ("perfilEconomicoId") REFERENCES "PerfilEconomico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoFinanceiro" ADD CONSTRAINT "PlanoFinanceiro_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjetivoFinanceiro" ADD CONSTRAINT "ObjetivoFinanceiro_planoFinanceiroId_fkey" FOREIGN KEY ("planoFinanceiroId") REFERENCES "PlanoFinanceiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatorioMensal" ADD CONSTRAINT "RelatorioMensal_planoFinanceiroId_fkey" FOREIGN KEY ("planoFinanceiroId") REFERENCES "PlanoFinanceiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnaliseImpacto" ADD CONSTRAINT "AnaliseImpacto_planoFinanceiroId_fkey" FOREIGN KEY ("planoFinanceiroId") REFERENCES "PlanoFinanceiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnaliseImpacto" ADD CONSTRAINT "AnaliseImpacto_transacaoId_fkey" FOREIGN KEY ("transacaoId") REFERENCES "Transacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_analiseImpactoId_fkey" FOREIGN KEY ("analiseImpactoId") REFERENCES "AnaliseImpacto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_historicoId_fkey" FOREIGN KEY ("historicoId") REFERENCES "Historico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_transacaoId_fkey" FOREIGN KEY ("transacaoId") REFERENCES "Transacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_perfilEconomicoId_fkey" FOREIGN KEY ("perfilEconomicoId") REFERENCES "PerfilEconomico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_transacaoId_fkey" FOREIGN KEY ("transacaoId") REFERENCES "Transacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_perfilEconomicoId_fkey" FOREIGN KEY ("perfilEconomicoId") REFERENCES "PerfilEconomico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnaliseImpactoObjetivo" ADD CONSTRAINT "AnaliseImpactoObjetivo_analiseImpactoId_fkey" FOREIGN KEY ("analiseImpactoId") REFERENCES "AnaliseImpacto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnaliseImpactoObjetivo" ADD CONSTRAINT "AnaliseImpactoObjetivo_objetivoFinanceiroId_fkey" FOREIGN KEY ("objetivoFinanceiroId") REFERENCES "ObjetivoFinanceiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

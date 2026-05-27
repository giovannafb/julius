import { prisma } from '../lib/prisma'
import argon2 from 'argon2'; //Adicionar import <---------

async function main() {
  const senhaHash = await argon2.hash('caju'); //Gerar hash
  // Limpar tabelas na ordem correta por causa das relações
  await prisma.notificacao.deleteMany();
  await prisma.analiseImpactoObjetivo.deleteMany();
  await prisma.analiseImpacto.deleteMany();
  await prisma.receita.deleteMany();
  await prisma.despesa.deleteMany();
  await prisma.transacao.deleteMany();
  await prisma.relatorioMensal.deleteMany();
  await prisma.objetivoFinanceiro.deleteMany();
  await prisma.planoFinanceiro.deleteMany();
  await prisma.historico.deleteMany();
  await prisma.perfilEconomico.deleteMany();
  await prisma.usuario.deleteMany();

  // Usuário
  const usuario = await prisma.usuario.create({
    data: {
      nome: "Giovanna Brito",
      login: "giovanna",
      senha: senhaHash,
      email: "giovanna@email.com",
      telefone: "35999999999",
    },
  });

  // Perfil econômico
  const perfil = await prisma.perfilEconomico.create({
    data: {
      saldo: 2500,
      status: true,
      usuarioId: usuario.id,
    },
  });

  // Histórico
  const historico = await prisma.historico.create({
    data: {
      perfilEconomicoId: perfil.id,
    },
  });

  // Plano financeiro
  const plano = await prisma.planoFinanceiro.create({
    data: {
      nome: "Plano Principal",
      saldoAtual: 2500,
      dataCriacao: new Date(),
      economiaMensalNecessaria: 400,
      usuarioId: usuario.id,
    },
  });

  // Objetivos financeiros
  const notebook = await prisma.objetivoFinanceiro.create({
    data: {
      nome: "Comprar notebook",
      valor: 4500,
      prazo: new Date("2026-12-31"),
      prioridade: 1,
      status: "PENDENTE",
      planoFinanceiroId: plano.id,
    },
  });

  const viagem = await prisma.objetivoFinanceiro.create({
    data: {
      nome: "Guardar dinheiro para viagem",
      valor: 8000,
      prazo: new Date("2027-06-30"),
      prioridade: 2,
      status: "PENDENTE",
      planoFinanceiroId: plano.id,
    },
  });

  // Transações
  const salarioTransacao = await prisma.transacao.create({
    data: {
      descricao: "Salário mensal",
      valor: 3000,
      data: new Date("2026-04-01"),
      periodicidade: "MENSAL",
      tipo: "RECEITA",
      historicoId: historico.id,
    },
  });

  await prisma.receita.create({
    data: {
      transacaoId: salarioTransacao.id,
      fonte: "Bolsa / trabalho",
      perfilEconomicoId: perfil.id,
    },
  });

  const aluguelTransacao = await prisma.transacao.create({
    data: {
      descricao: "Aluguel",
      valor: 900,
      data: new Date("2026-04-05"),
      periodicidade: "MENSAL",
      tipo: "DESPESA",
      historicoId: historico.id,
    },
  });

  await prisma.despesa.create({
    data: {
      transacaoId: aluguelTransacao.id,
      tipo: "Moradia",
      perfilEconomicoId: perfil.id,
    },
  });

  const mercadoTransacao = await prisma.transacao.create({
    data: {
      descricao: "Compra de mercado",
      valor: 350,
      data: new Date("2026-04-10"),
      periodicidade: "UNICA",
      tipo: "DESPESA",
      historicoId: historico.id,
    },
  });

  await prisma.despesa.create({
    data: {
      transacaoId: mercadoTransacao.id,
      tipo: "Alimentação",
    },
  });

  // Relatório mensal
  await prisma.relatorioMensal.create({
    data: {
      mes: "Abril/2026",
      dataEmissao: new Date("2026-04-29"),
      totalReceita: 3000,
      totalDespesas: 1250,
      saldoFinal: 1750,
      conclusaoObjetivos: 20,
      planoFinanceiroId: plano.id,
    },
  });

  // Análise de impacto
  const analise = await prisma.analiseImpacto.create({
    data: {
      dataAnalise: new Date(),
      comprometeObjetivos: true,
      planoFinanceiroId: plano.id,
      transacaoId: mercadoTransacao.id,
    },
  });

  // Notificação
  await prisma.notificacao.create({
    data: {
      mensagem: "A despesa de mercado pode impactar seus objetivos financeiros.",
      tipo: "ALERTA",
      dataEnvio: new Date(),
      lida: false,
      analiseImpactoId: analise.id,
    },
  });

  // Relação N:N entre análise e objetivos
  await prisma.analiseImpactoObjetivo.createMany({
    data: [
      {
        analiseImpactoId: analise.id,
        objetivoFinanceiroId: notebook.id,
      },
      {
        analiseImpactoId: analise.id,
        objetivoFinanceiroId: viagem.id,
      },
    ],
  });

  console.log("Seed executado com sucesso!");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
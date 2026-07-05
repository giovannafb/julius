export enum Periodicidade {
  UNICA = "UNICA",
  DIARIA = "DIARIA",
  SEMANAL = "SEMANAL",
  MENSAL = "MENSAL",
  ANUAL = "ANUAL"
}

export abstract class Transacao {
  constructor(
    private id: number,
    private descricao: string,
    private valor: number,
    private data: Date,
    private periodicidade: Periodicidade
  ) { }

  public abstract atualizarSaldo(saldoAtual: number): number;

  public getId(): number {
    return this.id;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public setDescricao(descricao: string): void {
    this.descricao = descricao;
  }

  public getValor(): number {
    return this.valor;
  }

  public setValor(valor: number): void {
    this.valor = valor;
  }

  public getData(): Date {
    return this.data;
  }

  public setData(data: Date): void {
    this.data = data;
  }

  public getPeriodicidade(): Periodicidade {
    return this.periodicidade;
  }

  public setPeriodicidade(periodicidade: Periodicidade): void {
    this.periodicidade = periodicidade;
  }

}

export class Receita extends Transacao {
  constructor(
    id: number,
    descricao: string,
    valor: number,
    data: Date,
    periodicidade: Periodicidade,
    private fonte: string
  ) {
    super(id, descricao, valor, data, periodicidade);
  }

  public override atualizarSaldo(saldoAtual: number): number {
    return saldoAtual + this.getValor();
  }

  public getFonte(): string {
    return this.fonte;
  }

  public setFonte(fonte: string): void {
    this.fonte = fonte;
  }
}

export class Despesa extends Transacao {
  constructor(
    id: number,
    descricao: string,
    valor: number,
    data: Date,
    periodicidade: Periodicidade,
  ) {
    super(id, descricao, valor, data, periodicidade);
  }

  public override atualizarSaldo(saldoAtual: number): number {
    return saldoAtual - this.getValor();
  }
}

export class ObjetivoFinanceiro {
  constructor(
    private id: number,
    private nome: string,
    private valor: number,
    private prazo: Date,
    private prioridade: number,
    private status: string = "PENDENTE"
  ) { }

  public concluir(): void {
    this.status = "CONCLUIDO";
  }

  public getId(): number {
    return this.id;
  }

  public getNome(): string {
    return this.nome;
  }

  public setNome(nome: string): void {
    this.nome = nome;
  }

  public getValor(): number {
    return this.valor;
  }

  public setValor(valor: number): void {
    this.valor = valor;
  }

  public getPrazo(): Date {
    return this.prazo;
  }

  public setPrazo(prazo: Date): void {
    this.prazo = prazo;
  }

  public getPrioridade(): number {
    return this.prioridade;
  }

  public setPrioridade(prioridade: number): void {
    this.prioridade = prioridade;
  }

  public getStatus(): string {
    return this.status;
  }

  public setStatus(status: string): void {
    this.status = status;
  }
}

export class Notificacao {
  constructor(
    private id: number,
    private mensagem: string,
    private tipo: string,
    private dataEnvio: Date,
    private lida: boolean = false
  ) { }

  public enviar(): void {
    console.log(`[${this.tipo}] ${this.mensagem}`);
  }

  public marcarComoLida(): void {
    this.lida = true;
  }

  public getId(): number {
    return this.id;
  }

  public getMensagem(): string {
    return this.mensagem;
  }

  public setMensagem(mensagem: string): void {
    this.mensagem = mensagem;
  }

  public getTipo(): string {
    return this.tipo;
  }

  public setTipo(tipo: string): void {
    this.tipo = tipo;
  }

  public getDataEnvio(): Date {
    return this.dataEnvio;
  }

  public setDataEnvio(dataEnvio: Date): void {
    this.dataEnvio = dataEnvio;
  }

  public isLida(): boolean {
    return this.lida;
  }
}

export class Historico {
  private transacoes: Transacao[] = [];

  public adicionarTransacao(transacao: Transacao): void {
    this.transacoes.push(transacao);
  }

  public limparHistorico(): void {
    this.transacoes = [];
  }

  public filtrar(predicate: (transacao: Transacao) => boolean): Transacao[] {
    return this.transacoes.filter(predicate);
  }

  public getTransacoes(): Transacao[] {
    return this.transacoes;
  }
}

export class PerfilEconomico {
  private receitasFixas: Receita[] = [];
  private despesasFixas: Despesa[] = [];
  private historico: Historico;
  private usuario?: Usuario;

  constructor(
    private saldo: number = 0,
    private status: boolean = true,
    usuario?: Usuario
  ) {
    this.historico = new Historico();
    if (usuario !== undefined) {
      this.usuario = usuario;
    }
  }

  public getUsuario(): Usuario | undefined {
    return this.usuario;
  }

  public setUsuario(usuario: Usuario): void {
    this.usuario = usuario;
  }

  public calcularStatus(): boolean {
    this.status = this.saldo >= 0;
    return this.status;
  }

  public adicionarReceitaFixa(receita: Receita): void {
    this.receitasFixas.push(receita);
  }

  public adicionarDespesaFixa(despesa: Despesa): void {
    this.despesasFixas.push(despesa);
  }


  public getSaldo(): number {
    return this.saldo;
  }

  public setSaldo(saldo: number): void {
    this.saldo = saldo;
    this.calcularStatus();
  }

  public getStatus(): boolean {
    return this.status;
  }

  public getReceitasFixas(): Receita[] {
    return this.receitasFixas;
  }

  public getDespesasFixas(): Despesa[] {
    return this.despesasFixas;
  }

  public getHistorico(): Historico {
    return this.historico;
  }
}

export class RelatorioMensal {
  constructor(
    private mes: string,
    private dataEmissao: Date,
    private totalDespesas: number = 0,
    private totalReceita: number = 0,
    private saldoFinal: number = 0,
    private objetivosConcluidos: number = 0
  ) { }

  public calcularSaldoFinal(): number {
    this.saldoFinal = this.totalReceita - this.totalDespesas;
    return this.saldoFinal;
  }

  public calcularObjetivosAtingidos(
    objetivos: ObjetivoFinanceiro[]
  ): number {
    const concluidos = objetivos.filter(
      (objetivo) => objetivo.getStatus() === "CONCLUIDO"
    ).length;

    this.objetivosConcluidos =
      objetivos.length > 0 ? (concluidos / objetivos.length) * 100 : 0;

    return this.objetivosConcluidos;
  }

  public getMes(): string {
    return this.mes;
  }

  public getDataEmissao(): Date {
    return this.dataEmissao;
  }

  public getTotalDespesas(): number {
    return this.totalDespesas;
  }

  public setTotalDespesas(totalDespesas: number): void {
    this.totalDespesas = totalDespesas;
  }

  public getTotalReceita(): number {
    return this.totalReceita;
  }

  public setTotalReceita(totalReceita: number): void {
    this.totalReceita = totalReceita;
  }

  public getSaldoFinal(): number {
    return this.saldoFinal;
  }

  public getobjetivosConcluidos(): number {
    return this.objetivosConcluidos;
  }
}

export class AnaliseImpacto {
  private objetivosComprometidos: ObjetivoFinanceiro[] = [];
  private notificacao?: Notificacao;

  constructor(
    private id: number,
    private dataAnalise: Date,
    private comprometeObjetivos: boolean = false,
    private transacao?: Transacao,
    private objetivoOrigem?: ObjetivoFinanceiro
  ) { }

  public avaliarViabilidadeObjetivos(
    objetivos: ObjetivoFinanceiro[],
    saldoAtual: number
  ): boolean {
    this.objetivosComprometidos = objetivos.filter(
      (objetivo) =>
        objetivo.getStatus() !== "CONCLUIDO" &&
        objetivo.getValor() > saldoAtual
    );

    this.comprometeObjetivos = this.objetivosComprometidos.length > 0;

    if (this.comprometeObjetivos) {
      const nomesObjetivos = this.objetivosComprometidos.map(o => o.getNome()).join(", ");
      let mensagem = "Objetivos financeiros comprometidos.";

      if (this.transacao) {
        mensagem = `A transação '${this.transacao.getDescricao()}' pode comprometer o(s) objetivo(s): ${nomesObjetivos}.`;
      } else if (this.objetivoOrigem) {
        mensagem = `O novo objetivo '${this.objetivoOrigem.getNome()}' evidenciou que o saldo é insuficiente para o(s) objetivo(s): ${nomesObjetivos}.`;
      }

      this.notificacao = new Notificacao(
        Date.now(),
        mensagem,
        "ALERTA",
        new Date(),
        false
      );
    }

    return this.comprometeObjetivos;
  }

  public getId(): number {
    return this.id;
  }

  public getDataAnalise(): Date {
    return this.dataAnalise;
  }

  public isComprometeObjetivos(): boolean {
    return this.comprometeObjetivos;
  }

  public getTransacao(): Transacao | undefined {
    return this.transacao;
  }

  public getObjetivoOrigem(): ObjetivoFinanceiro | undefined {
    return this.objetivoOrigem;
  }

  public getObjetivosComprometidos(): ObjetivoFinanceiro[] {
    return this.objetivosComprometidos;
  }

  public getNotificacao(): Notificacao | undefined {
    return this.notificacao;
  }
}

export class PlanoFinanceiro {
  private objetivos: ObjetivoFinanceiro[] = [];
  private relatoriosMensais: RelatorioMensal[] = [];
  private relatorioImpactos: AnaliseImpacto[] = [];

  constructor(
    private id: number,
    private nome: string,
    private dataCriacao: Date,
    private economiaMensalNecessaria: number = 0
  ) { }

  public adicionarObjetivo(objetivo: ObjetivoFinanceiro): void {
    this.objetivos.push(objetivo);
  }

  public removerObjetivo(id: number): void {
    this.objetivos = this.objetivos.filter(objetivo => objetivo.getId() !== id);
  }

  public gerarRelatorioMensal(relatorio: RelatorioMensal): void {
    this.relatoriosMensais.push(relatorio);
  }

  public adicionarAnaliseImpacto(analise: AnaliseImpacto): void {
    this.relatorioImpactos.push(analise);
  }

  public calcularEconomiaMensal(): number {
    const objetivosPendentes = this.objetivos.filter(
      (objetivo) => objetivo.getStatus() !== "CONCLUIDO"
    );

    if (objetivosPendentes.length === 0) {
      this.economiaMensalNecessaria = 0;
      return this.economiaMensalNecessaria;
    }

    const hoje = new Date();
    let totalMensal = 0;

    for (const objetivo of objetivosPendentes) {
      const diffMeses =
        (objetivo.getPrazo().getFullYear() - hoje.getFullYear()) * 12 +
        (objetivo.getPrazo().getMonth() - hoje.getMonth());

      const mesesRestantes = Math.max(diffMeses, 1);
      totalMensal += objetivo.getValor() / mesesRestantes;
    }

    this.economiaMensalNecessaria = totalMensal;
    return this.economiaMensalNecessaria;
  }

  public calcularStatusObjetivos(): string {
    const pendentes = this.objetivos.filter(
      (objetivo) => objetivo.getStatus() === "PENDENTE"
    ).length;
    const concluidos = this.objetivos.filter(
      (objetivo) => objetivo.getStatus() === "CONCLUIDO"
    ).length;

    return `Pendentes: ${pendentes}, Concluídos: ${concluidos}`;
  }

  public getId(): number {
    return this.id;
  }

  public getNome(): string {
    return this.nome;
  }

  public setNome(nome: string): void {
    this.nome = nome;
  }



  public getDataCriacao(): Date {
    return this.dataCriacao;
  }

  public getEconomiaMensalNecessaria(): number {
    return this.economiaMensalNecessaria;
  }


  public getObjetivos(): ObjetivoFinanceiro[] {
    return this.objetivos;
  }

  public getRelatoriosMensais(): RelatorioMensal[] {
    return this.relatoriosMensais;
  }

  public getRelatorioImpactos(): AnaliseImpacto[] {
    return this.relatorioImpactos;
  }
}

export class Usuario {
  private planosFinanceiros: PlanoFinanceiro[] = [];
  private perfilEconomico: PerfilEconomico;

  constructor(
    private id: number,
    private nome: string,
    private login: string,
    private senha: string,
    private email: string,
    private telefone: string,
    perfilEconomico?: PerfilEconomico
  ) {
    this.perfilEconomico = perfilEconomico || new PerfilEconomico(0, true, this);
    if (!this.perfilEconomico.getUsuario()) {
      this.perfilEconomico.setUsuario(this);
    }
  }

  public autenticar(login: string, senha: string): boolean {
    return this.login === login && this.senha === senha;
  }

  public atualizarPerfil(
    nome: string,
    email: string,
    telefone: string
  ): void {
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
  }

  public adicionarPlanoFinanceiro(plano: PlanoFinanceiro): void {
    this.planosFinanceiros.push(plano);
  }

  public setPerfilEconomico(perfil: PerfilEconomico): void {
    this.perfilEconomico = perfil;
  }

  public getId(): number {
    return this.id;
  }

  public getNome(): string {
    return this.nome;
  }

  public setNome(nome: string): void {
    this.nome = nome;
  }

  public getLogin(): string {
    return this.login;
  }

  public setLogin(login: string): void {
    this.login = login;
  }

  public getSenha(): string {
    return this.senha;
  }

  public setSenha(senha: string): void {
    this.senha = senha;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getTelefone(): string {
    return this.telefone;
  }

  public setTelefone(telefone: string): void {
    this.telefone = telefone;
  }

  public getPlanosFinanceiros(): PlanoFinanceiro[] {
    return this.planosFinanceiros;
  }

  public getPerfilEconomico(): PerfilEconomico {
    return this.perfilEconomico;
  }
}
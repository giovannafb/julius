export const despesaSchema = {
  type: 'object',
  properties: {
    transacaoId: { type: 'integer' },
    perfilEconomicoId: { type: 'integer', nullable: true },
    transacao: {
      type: 'object',
      properties: {
        descricao: { type: 'string' },
        valor: { type: 'number' },
        data: { type: 'string', format: 'date-time' },
        tipo: { type: 'string', enum: ['RECEITA', 'DESPESA'] },
        periodicidade: { type: 'string', enum: ['UNICA', 'DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL'] }
      }
    }
  },
};

export const despesaBodySchema = {
  type: 'object',
  required: ['descricao', 'valor', 'data', 'periodicidade'],
  properties: {
    descricao: { type: 'string' },
    valor: { type: 'number' },
    data: { type: 'string', format: 'date-time' },
    periodicidade: { type: 'string', enum: ['UNICA', 'DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL'] },
    perfilEconomicoId: { type: 'integer', nullable: true },
  },
};

const params = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
};

export const getDespesaSchema = {
  schema: {
    tags: ['Despesas'],
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: despesaSchema } },
  },
};

export const postDespesaSchema = {
  schema: {
    tags: ['Despesas'],
    security: [{ bearerAuth: [] }],
    body: despesaBodySchema,
    response: { 201: despesaSchema },
  },
};

export const getDespesaByIdSchema = {
  schema: { 
    tags: ['Despesas'], 
    security: [{ bearerAuth: [] }],
    params, 
    response: { 200: despesaSchema } 
  },
};

export const putDespesaSchema = {
  schema: { 
    tags: ['Despesas'], 
    security: [{ bearerAuth: [] }],
    params, 
    body: { ...despesaBodySchema, required: [] } 
  },
};

export const deleteDespesaSchema = {
  schema: { 
    tags: ['Despesas'], 
    security: [{ bearerAuth: [] }],
    params 
  },
};
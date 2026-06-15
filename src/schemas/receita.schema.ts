export const receitaSchema = {
  type: 'object',
  properties: {
    transacaoId: { type: 'integer' },
    fonte: { type: 'string' },
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

export const receitaBodySchema = {
  type: 'object',
  required: ['descricao', 'valor', 'data', 'periodicidade', 'fonte'],
  properties: {
    descricao: { type: 'string' },
    valor: { type: 'number' },
    data: { type: 'string', format: 'date-time' },
    periodicidade: { type: 'string', enum: ['UNICA', 'DIARIA', 'SEMANAL', 'MENSAL', 'ANUAL'] },
    fonte: { type: 'string' },
    perfilEconomicoId: { type: 'integer', nullable: true },
  },
};

const params = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
};

export const getReceitaSchema = {
  schema: {
    tags: ['Receitas'],
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: receitaSchema } },
  },
};

export const postReceitaSchema = {
  schema: {
    tags: ['Receitas'],
    security: [{ bearerAuth: [] }],
    body: receitaBodySchema,
    response: { 201: receitaSchema },
  },
};

export const getReceitaByIdSchema = {
  schema: { 
    tags: ['Receitas'], 
    security: [{ bearerAuth: [] }],
    params, 
    response: { 200: receitaSchema } 
  },
};

export const putReceitaSchema = {
  schema: { 
    tags: ['Receitas'], 
    security: [{ bearerAuth: [] }],
    params, 
    body: { ...receitaBodySchema, required: [] } 
  },
};

export const deleteReceitaSchema = {
  schema: { 
    tags: ['Receitas'], 
    security: [{ bearerAuth: [] }],
    params 
  },
};
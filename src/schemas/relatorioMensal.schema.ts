export const relatorioMensalSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    mes: { type: 'string' },
    dataEmissao: { type: 'string', format: 'date-time' },
    totalDespesas: { type: 'number' },
    totalReceita: { type: 'number' },
    saldoFinal: { type: 'number' },
    objetivosConcluidos: { type: 'number' },
    planoFinanceiroId: { type: 'integer' },
  },
};

export const relatorioMensalBodySchema = {
  type: 'object',
  required: ['mes', 'dataEmissao', 'planoFinanceiroId'],
  properties: {
    mes: { type: 'string' },
    dataEmissao: { type: 'string', format: 'date-time' },
    totalDespesas: { type: 'number' },
    totalReceita: { type: 'number' },
    saldoFinal: { type: 'number' },
    objetivosConcluidos: { type: 'number' },
    planoFinanceiroId: { type: 'integer' },
  },
};

const params = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
};

export const getRelatorioSchema = {
  schema: {
    tags: ['Relatorios'],
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: relatorioMensalSchema } },
  },
};

export const postRelatorioSchema = {
  schema: {
    tags: ['Relatorios'],
    security: [{ bearerAuth: [] }],
    body: relatorioMensalBodySchema,
    response: { 201: relatorioMensalSchema },
  },
};

export const getRelatorioByIdSchema = {
  schema: { 
    tags: ['Relatorios'], 
    security: [{ bearerAuth: [] }],
    params, 
    response: { 200: relatorioMensalSchema } 
  },
};

export const putRelatorioSchema = {
  schema: { 
    tags: ['Relatorios'], 
    security: [{ bearerAuth: [] }],
    params, 
    body: relatorioMensalBodySchema 
  },
};

export const deleteRelatorioSchema = {
  schema: { 
    tags: ['Relatorios'], 
    security: [{ bearerAuth: [] }],
    params 
  },
};
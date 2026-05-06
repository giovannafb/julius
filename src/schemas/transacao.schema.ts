export const transacaoSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    descricao: { type: 'string' },
    valor: { type: 'number' },
    data: { type: 'string', format: 'date-time' },
    tipo: { type: 'string' },
    periodicidade: { type: 'string' }
  },
};

export const transacaoBodySchema = {
  type: 'object',
  required: ['descricao', 'valor', 'data', 'tipo', 'periodicidade'],
  properties: transacaoSchema.properties,
};

const params = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
};

export const getTransacaoSchema = {
  schema: {
    tags: ['Transacao'],
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: transacaoSchema } },
  },
};

export const postTransacaoSchema = {
  schema: {
    tags: ['Transacao'],
    security: [{ bearerAuth: [] }],
    body: transacaoBodySchema,
  },
};

export const getTransacaoByIdSchema = {
  schema: {
    tags: ['Transacao'],
    security: [{ bearerAuth: [] }],
    params,
  },
};

export const putTransacaoSchema = {
  schema: {
    tags: ['Transacao'],
    params,
    security: [{ bearerAuth: [] }],
    body: transacaoBodySchema,
  },
};

export const deleteTransacaoSchema = {
  schema: {
    tags: ['Transacao'],
    security: [{ bearerAuth: [] }],
    params,
  },
};
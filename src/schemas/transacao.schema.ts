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
    response: { 200: { type: 'array', items: transacaoSchema } },
  },
};

export const postTransacaoSchema = {
  schema: {
    tags: ['Transacao'],
    body: transacaoBodySchema,
  },
};

export const getTransacaoByIdSchema = {
  schema: {
    tags: ['Transacao'],
    params,
  },
};

export const putTransacaoSchema = {
  schema: {
    tags: ['Transacao'],
    params,
    body: transacaoBodySchema,
  },
};

export const deleteTransacaoSchema = {
  schema: {
    tags: ['Transacao'],
    params,
  },
};
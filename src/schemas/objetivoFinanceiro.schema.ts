export const objetivoSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    nome: { type: 'string' },
    valor: { type: 'number' },
    prazo: { type: 'string', format: 'date-time' },
    prioridade: { type: 'integer' },
    status: { type: 'string' }
  },
};

export const objetivoBodySchema = {
  type: 'object',
  required: ['nome', 'valor', 'prazo', 'prioridade', 'status'],
  properties: objetivoSchema.properties,
};

const params = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
};

export const getObjetivoSchema = {
  schema: {
    tags: ['ObjetivoFinanceiro'],
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: objetivoSchema } },
  },
};

export const postObjetivoSchema = {
  schema: {
    tags: ['ObjetivoFinanceiro'],
    security: [{ bearerAuth: [] }],
    body: objetivoBodySchema,
  },
};

export const getObjetivoByIdSchema = {
  schema: {
    tags: ['ObjetivoFinanceiro'],
    security: [{ bearerAuth: [] }],
    params,
  },
};

export const putObjetivoSchema = {
  schema: {
    tags: ['ObjetivoFinanceiro'],
    security: [{ bearerAuth: [] }],
    params,
    body: objetivoBodySchema,
  },
};

export const deleteObjetivoSchema = {
  schema: {
    tags: ['ObjetivoFinanceiro'],
    security: [{ bearerAuth: [] }],
    params,
  },
};
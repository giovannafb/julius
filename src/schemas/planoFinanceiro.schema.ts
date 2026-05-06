export const planoSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    nome: { type: 'string' },
    saldoAtual: { type: 'number' },
    dataCriacao: { type: 'string', format: 'date-time' },
    usuarioId: { type: 'integer' }
  },
};

export const planoBodySchema = {
  type: 'object',
  required: ['nome', 'saldoAtual', 'dataCriacao', 'usuarioId'],
  properties: planoSchema.properties,
};

const params = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
};

export const getPlanoSchema = {
  schema: { tags: ['Plano Financeiro'], response: { 200: { type: 'array', items: planoSchema } } },
};

export const postPlanoSchema = {
  schema: { tags: ['Plano Financeiro'], security: [{ bearerAuth: [] }], body: planoBodySchema },
};

export const getPlanoByIdSchema = {
  schema: { tags: ['Plano Financeiro'], params, security: [{ bearerAuth: [] }], },
};

export const putPlanoSchema = {
  schema: { tags: ['Plano Financeiro'], params, body: planoBodySchema , security: [{ bearerAuth: [] }],},
};

export const deletePlanoSchema = {
  schema: { tags: ['Plano Financeiro'], params , security: [{ bearerAuth: [] }],},
};
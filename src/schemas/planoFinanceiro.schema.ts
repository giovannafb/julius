export const planoSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    nome: { type: 'string' },
    dataCriacao: { type: 'string', format: 'date-time' },
    economiaMensalNecessaria: { type: 'number' },
    usuarioId: { type: 'integer' },
    objetivos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          valor: { type: 'number' },
          prazo: { type: 'string', format: 'date-time' },
          prioridade: { type: 'integer' },
          status: { type: 'string' },
          planoFinanceiroId: { type: 'integer' }
        }
      }
    }
  },
};

export const planoBodySchema = {
  type: 'object',
  required: ['nome', 'dataCriacao', 'usuarioId'],
  properties: {
    nome: { type: 'string' },
    dataCriacao: { type: 'string', format: 'date-time' },
    economiaMensalNecessaria: { type: 'number' },
    usuarioId: { type: 'integer' }
  },
};

const params = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
};

export const getPlanoSchema = {
  schema: { tags: ['Plano Financeiro'], security: [{ bearerAuth: [] }], response: { 200: { type: 'array', items: planoSchema } } },
};

export const postPlanoSchema = {
  schema: { tags: ['Plano Financeiro'], security: [{ bearerAuth: [] }], body: planoBodySchema },
};

export const getPlanoByIdSchema = {
  schema: { tags: ['Plano Financeiro'], params, security: [{ bearerAuth: [] }], },
};

export const putPlanoSchema = {
  schema: { tags: ['Plano Financeiro'], params, body: planoBodySchema, security: [{ bearerAuth: [] }], },
};

export const deletePlanoSchema = {
  schema: { tags: ['Plano Financeiro'], params, security: [{ bearerAuth: [] }], },
};
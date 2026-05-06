export const historicoSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    perfilEconomicoId: { type: 'integer' },
  },
};

export const historicoBodySchema = {
  type: 'object',
  required: ['perfilEconomicoId'],
  properties: {
    perfilEconomicoId: { type: 'integer' },
  },
};

const params = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
};

export const getHistoricoSchema = {
  schema: {
    tags: ['Historicos'],
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: historicoSchema } },
  },
};

export const postHistoricoSchema = {
  schema: {
    tags: ['Historicos'],
    security: [{ bearerAuth: [] }],
    body: historicoBodySchema,
    response: { 201: historicoSchema },
  },
};

export const getHistoricoByIdSchema = {
  schema: { 
    tags: ['Historicos'], 
    security: [{ bearerAuth: [] }],
    params, 
    response: { 200: historicoSchema } 
  },
};

export const putHistoricoSchema = {
  schema: { 
    tags: ['Historicos'], 
    security: [{ bearerAuth: [] }],
    params, 
    body: historicoBodySchema 
  },
};

export const deleteHistoricoSchema = {
  schema: { 
    tags: ['Historicos'], 
    security: [{ bearerAuth: [] }],
    params 
  },
};
export const receitaSchema = {
  type: 'object',
  properties: {
    transacaoId: { type: 'integer' },
    fonte: { type: 'string' },
    perfilEconomicoId: { type: 'integer', nullable: true },
  },
};

export const receitaBodySchema = {
  type: 'object',
  required: ['transacaoId', 'fonte'],
  properties: receitaSchema.properties,
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
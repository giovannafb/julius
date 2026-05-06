export const despesaSchema = {
  type: 'object',
  properties: {
    transacaoId: { type: 'integer' },
    tipo: { type: 'string' },
    perfilEconomicoId: { type: 'integer', nullable: true },
  },
};

export const despesaBodySchema = {
  type: 'object',
  required: ['transacaoId', 'tipo'],
  properties: despesaSchema.properties,
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
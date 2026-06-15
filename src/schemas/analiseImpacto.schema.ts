export const analiseImpactoSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    dataAnalise: { type: 'string', format: 'date-time' },
    comprometeObjetivos: { type: 'boolean' },
    planoFinanceiroId: { type: 'integer' },
    transacaoId: { type: 'integer', nullable: true },
    objetivoOrigemId: { type: 'integer', nullable: true },
  },
};

export const analiseImpactoBodySchema = {
  type: 'object',
  required: ['dataAnalise', 'planoFinanceiroId'],
  properties: {
    dataAnalise: { type: 'string', format: 'date-time' },
    comprometeObjetivos: { type: 'boolean' },
    planoFinanceiroId: { type: 'integer' },
    transacaoId: { type: 'integer', nullable: true },
    objetivoOrigemId: { type: 'integer', nullable: true },
  },
};

const params = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
};

export const getAnaliseImpactoSchema = {
  schema: {
    tags: ['Analises Impacto'],
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: analiseImpactoSchema } },
  },
};

export const postAnaliseImpactoSchema = {
  schema: {
    tags: ['Analises Impacto'],
    security: [{ bearerAuth: [] }],
    body: analiseImpactoBodySchema,
    response: { 201: analiseImpactoSchema },
  },
};

export const getAnaliseImpactoByIdSchema = {
  schema: { 
    tags: ['Analises Impacto'], 
    security: [{ bearerAuth: [] }],
    params, 
    response: { 200: analiseImpactoSchema } 
  },
};

export const putAnaliseImpactoSchema = {
  schema: { 
    tags: ['Analises Impacto'], 
    security: [{ bearerAuth: [] }],
    params, 
    body: analiseImpactoBodySchema 
  },
};

export const deleteAnaliseImpactoSchema = {
  schema: { 
    tags: ['Analises Impacto'], 
    security: [{ bearerAuth: [] }],
    params 
  },
};
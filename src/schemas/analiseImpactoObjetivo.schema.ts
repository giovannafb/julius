export const analiseImpactoObjetivoSchema = {
  type: 'object',
  properties: {
    analiseImpactoId: { type: 'integer' },
    objetivoFinanceiroId: { type: 'integer' },
  },
};

export const analiseImpactoObjetivoBodySchema = {
  type: 'object',
  required: ['analiseImpactoId', 'objetivoFinanceiroId'],
  properties: analiseImpactoObjetivoSchema.properties,
};

const compositeParams = {
  type: 'object',
  properties: { 
    analiseId: { type: 'string' },
    objetivoId: { type: 'string' }
  },
  required: ['analiseId', 'objetivoId'],
};

export const getAnaliseObjetivoSchema = {
  schema: {
    tags: ['Analise Impacto Objetivos'],
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: analiseImpactoObjetivoSchema } },
  },
};

export const postAnaliseObjetivoSchema = {
  schema: {
    tags: ['Analise Impacto Objetivos'],
    security: [{ bearerAuth: [] }],
    body: analiseImpactoObjetivoBodySchema,
    response: { 201: analiseImpactoObjetivoSchema },
  },
};

export const deleteAnaliseObjetivoSchema = {
  schema: { 
    tags: ['Analise Impacto Objetivos'], 
    security: [{ bearerAuth: [] }],
    params: compositeParams 
  },
};
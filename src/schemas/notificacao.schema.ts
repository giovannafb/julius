export const notificacaoSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    mensagem: { type: 'string' },
    tipo: { type: 'string' }, // Referente ao Enum TipoNotificacao
    dataEnvio: { type: 'string', format: 'date-time' },
    lida: { type: 'boolean' },
    analiseImpactoId: { type: 'integer' },
    analiseImpacto: {
      type: 'object',
      nullable: true,
      properties: {
        planoFinanceiro: {
          type: 'object',
          nullable: true,
          properties: {
            usuarioId: { type: 'integer' }
          }
        }
      }
    }
  },
};

export const notificacaoBodySchema = {
  type: 'object',
  required: ['mensagem', 'tipo', 'dataEnvio', 'analiseImpactoId'],
  properties: {
    mensagem: { type: 'string' },
    tipo: { type: 'string' },
    dataEnvio: { type: 'string', format: 'date-time' },
    lida: { type: 'boolean' },
    analiseImpactoId: { type: 'integer' },
  },
};

const params = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
};

export const getNotificacaoSchema = {
  schema: {
    tags: ['Notificacoes'],
    security: [{ bearerAuth: [] }],
    response: { 200: { type: 'array', items: notificacaoSchema } },
  },
};

export const postNotificacaoSchema = {
  schema: {
    tags: ['Notificacoes'],
    security: [{ bearerAuth: [] }],
    body: notificacaoBodySchema,
    response: { 201: notificacaoSchema },
  },
};

export const getNotificacaoByIdSchema = {
  schema: { 
    tags: ['Notificacoes'], 
    security: [{ bearerAuth: [] }],
    params, 
    response: { 200: notificacaoSchema } 
  },
};

export const putNotificacaoSchema = {
  schema: { 
    tags: ['Notificacoes'], 
    security: [{ bearerAuth: [] }],
    params, 
    body: notificacaoBodySchema 
  },
};

export const deleteNotificacaoSchema = {
  schema: { 
    tags: ['Notificacoes'], 
    security: [{ bearerAuth: [] }],
    params 
  },
};
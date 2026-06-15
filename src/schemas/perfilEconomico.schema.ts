export const perfilSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    saldo: { type: 'number' },
    status: { type: 'boolean' },
    usuarioId: { type: 'integer' }
  }
};

export const perfilBody = {
  type: 'object',
  required: ['saldo', 'status', 'usuarioId'],
  properties: {
    saldo: { type: 'number' },
    status: { type: 'boolean' },
    usuarioId: { type: 'integer' }
  }
};

const params = {
  type: 'object',
  required: ['id'],
  properties: { id: { type: 'string' } }
};

export const getPerfilSchema = { schema: { tags: ['Perfis Economicos'], security: [{ bearerAuth: [] }], response: { 200: { type: 'array', items: perfilSchema } } } };
export const postPerfilSchema = { schema: { tags: ['Perfis Economicos'], security: [{ bearerAuth: [] }], body: perfilBody } };
export const getPerfilByIdSchema = { schema: { tags: ['Perfis Economicos'], security: [{ bearerAuth: [] }], params } };
export const putPerfilSchema = { schema: { tags: ['Perfis Economicos'], security: [{ bearerAuth: [] }], params, body: perfilBody } };
export const deletePerfilSchema = { schema: { tags: ['Perfis Economicos'], params, security: [{ bearerAuth: [] }], } };
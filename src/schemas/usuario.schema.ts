export const usuarioSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    nome: { type: 'string' },
    login: { type: 'string' },
    senha: { type: 'string' },
    email: { type: 'string' },
    telefone: { type: 'string' },
  },
};

export const usuarioBodySchema = {
  type: 'object',
  required: ['nome', 'login', 'senha', 'email', 'telefone'],
  properties: usuarioSchema.properties,
};

const params = {
  type: 'object',
  properties: { id: { type: 'string' } },
  required: ['id'],
};

export const getUsuarioSchema = {
  schema: {
    tags: ['Usuarios'],
    response: { 200: { type: 'array', items: usuarioSchema } },
  },
};

export const postUsuarioSchema = {
  schema: {
    tags: ['Usuarios'],
    body: usuarioBodySchema,
    response: { 201: usuarioSchema },
  },
};

export const getUsuarioByIdSchema = {
  schema: { tags: ['Usuarios'], params, response: { 200: usuarioSchema } },
};

export const putUsuarioSchema = {
  schema: { tags: ['Usuarios'], params, body: usuarioBodySchema },
};

export const deleteUsuarioSchema = {
  schema: { tags: ['Usuarios'], params },
};
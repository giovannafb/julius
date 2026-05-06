const loginSchema = {
    type: 'object',
    properties: {
        login: { type: 'string' },
        senha: { type: 'string' },
    },
} as const
const loginResponseSchema = {
    type: 'object',
    properties: {
        message: { type: 'string' },
        token: { type: 'string' },
    },
} as const
export const getAuthSchema = {
    schema: {
        tags: ['Auth'],
        summary: 'Autentica um usuário e retorna um token JWT',
        body: loginSchema,
        response: { 200: loginResponseSchema },
    },
}
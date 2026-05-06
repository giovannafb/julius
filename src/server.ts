import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import transacaoRoutes from './routes/transacao.route.js';
import usuarioRoutes from './routes/usuario.route.js';
import perfilEconomicoRoutes from './routes/perfilEconomico.route.js';
import planoFinanceiroRoutes from './routes/planoFinanceiro.route.js';
import objetivoFinanceiroRoutes from './routes/objetivoFinanceiro.route.js';
import authRoutes from './routes/auth.route.js'
import { authMiddleware } from './middlewares/auth.middleware.js';
import historicoRoutes from './routes/historico.route.js';
import relatorioMensalRoutes from './routes/relatorioMensal.route.js';
import analiseImpactoRoutes from './routes/analiseImpacto.route.js';
import notificacaoRoutes from './routes/notificacao.route.js';
import receitaRoutes from './routes/receita.route.js';
import despesaRoutes from './routes/despesa.route.js';
import analiseImpactoObjetivoRoutes from './routes/analiseImpactoObjetivo.route.js';

//instância servidor web Fastify, ativando logs

const app = Fastify({ logger: true });
await app.register(cors, {
    origin: "*",
    methods: "*",
});
await app.register(fastifySwagger, {
    mode: 'dynamic',
    openapi: {
        info: {
            title: 'Julius API',
            description: 'API REST CAJU',
            version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            },
        }
    }
})
await app.register(fastifySwaggerUi, {
    routePrefix: '/swag',
})
app.register(transacaoRoutes, { prefix: '/transacoes' });
app.register(usuarioRoutes, { prefix: '/usuarios' });
app.register(perfilEconomicoRoutes, { prefix: '/perfisEconomicos' });
app.register(planoFinanceiroRoutes, { prefix: '/planosFinanceiros' });
app.register(objetivoFinanceiroRoutes, { prefix: '/objetivosFinanceiros' });
app.register(authRoutes, { prefix: '/auth' })
app.register(historicoRoutes, { prefix: '/historicos' });
app.register(relatorioMensalRoutes, { prefix: '/relatoriosMensais' });
app.register(analiseImpactoRoutes, { prefix: '/analisesImpacto' });
app.register(notificacaoRoutes, { prefix: '/notificacoes' });
app.register(receitaRoutes, { prefix: '/receitas' });
app.register(despesaRoutes, { prefix: '/despesas' });
app.register(analiseImpactoObjetivoRoutes, { prefix: '/analisesImpactoObjetivos' });


const PUBLIC_ROUTES = ['/auth/login', '/swag', '/swag/']
app.addHook('onRequest', async (request, reply) => {
    if (!request.url) {
        reply.code(400).send({ error: 'Bad Request' })
        return
    }
    const url = request.url!.split('?')[0] ?? request.url! // ignora query string
    // Permite rotas públicas e tudo que começa com /docs (ex: /docs/static/...)
    if (PUBLIC_ROUTES.includes(url) || url.startsWith('/swag')) {
        return
    }
    // Sua lógica aqui (ex: validar JWT)
    const token = request.headers.authorization
    if (!token) {
        reply.code(401).send({ error: 'Unauthorized' })
        return
    }
})

const start = async () => { // Função assíncrona chamada start
    try { // Inicia o servidor na porta 3000
        await app.listen({ port: 3000 });
        console.log('Server running on http://localhost:3000');
    } catch (err) { //registra no log caso erro ao iniciar
        app.log.error(err);
        process.exit(1);
    }
};
// Executa a função start
start();
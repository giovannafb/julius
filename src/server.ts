import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import transacaoRoutes from './routes/transacao.route.js';
import usuarioRoutes from './routes/usuario.route.js';
import perfilEconomicoRoutes from './routes/perfilEconomico.route.js';
import planoFinanceiroRoutes from './routes/planoFinanceiro.route.js';
import objetivoFinanceiroRoutes from './routes/objetivoFinanceiro.route.js';
//instância servidor web Fastify, ativando logs
const app = Fastify({ logger: true });
await app.register(cors, {
    origin: "*",
    methods: "*",
});
await app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Julius API',
            description: 'API REST CAJU',
            version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
})
await app.register(fastifySwaggerUi, {
    routePrefix: '/swag',
})
app.register(transacaoRoutes, { prefix: '/transacoes' });
app.register(usuarioRoutes, { prefix: '/usuarios' });
app.register(perfilEconomicoRoutes, { prefix: '/perfisEconomicos' });
app.register(planoFinanceiroRoutes, { prefix: '/planosFinanceiros' });
app.register(objetivoFinanceiroRoutes, { prefix: '/objetivosFinanceiros' });

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
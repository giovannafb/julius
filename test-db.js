import pg from 'pg';
const { Client } = pg;
const client = new Client({ connectionString: 'postgres://postgres:postgres@localhost:5432/julius' });
await client.connect();
const res = await client.query('SELECT * FROM "AnaliseImpacto" ORDER BY id DESC LIMIT 5');
console.log('AnaliseImpacto:', res.rows);
const res2 = await client.query('SELECT * FROM "AnaliseImpactoObjetivo"');
console.log('AnaliseImpactoObjetivo:', res2.rows);
await client.end();

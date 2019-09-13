import express, { Express } from 'express';

const app: Express = express();
app.set('port', process.env.port || 3000);

export default app;

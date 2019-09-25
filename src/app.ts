import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import signale from 'signale';
import { Server } from 'http';
import io from 'socket.io';

import getConnection from './db';
import defineAppRoutes from './routes';

const requestLogger = (req: Request, _: Response, next: Function): void => {
  let queryParams = '';
  let body = '';

  if (Object.keys(req.params).length > 0) {
    queryParams = `| query params: ${JSON.stringify(req.params)}`;
  }

  if (Object.keys(req.body).length > 0) {
    body = `| body: ${JSON.stringify(req.body)}`;
  }

  signale.log(`[${req.method}] ${req.url} ${queryParams}${body}`);
  next();
};

export default async (): Promise<Express> => {
  const app: Express = express();

  app.set('port', process.env.port || 3000);
  app.use(bodyParser.json());
  app.use(requestLogger);

  await getConnection();

  defineAppRoutes(app);

  // socket
  const server: Server = new Server(app);
  server.listen(3333);
  const socketServer = io(server);

  socketServer.on('connection', socket => {
    console.log('a user connected');
  });

  app.set('socketServer', socketServer);

  return app;
};

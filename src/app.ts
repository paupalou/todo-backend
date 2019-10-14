import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import signale from 'signale';
import http, { Server } from 'http';
import io, { Server as SocketServer } from 'socket.io';

import getConnection from './db';
import defineAppRoutes from './router';

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

  app.set('port', process.env.port || 5000);
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(requestLogger);

  await getConnection();

  // socket
  const server: Server = http.createServer(app);
  server.listen(3333);
  const socketServer: SocketServer = io(server);

  socketServer.on('connection', socket => {
    socket.on('join', room => {
      signale.start(`user ${room} joined the room`);
      socket.join(room);
    });

    socket.on('leave', room => {
      signale.complete(`user ${room} left the room`);
      socket.leave(room);
    });
  });

  defineAppRoutes(app, socketServer);

  return app;
};

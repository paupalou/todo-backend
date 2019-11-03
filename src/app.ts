import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http, { Server } from 'http';
import signale, { Signale } from 'signale';
import io, { Server as SocketServer } from 'socket.io';
import { ApolloServer } from 'apollo-server-express';

import requestLogger from './logger';
import getConnection from './db';
import GraphQL from './graphql';

interface Context {
  req: Request;
  res: Response;
  socket: SocketServer;
  logger: Signale;
}

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
      signale.log(`user ${room} joined the room`);
      socket.join(room);
    });

    socket.on('leave', room => {
      signale.log(`user ${room} left the room`);
      socket.leave(room);
    });
  });

  // graphql
  const graphqlServer = new ApolloServer({
    typeDefs: GraphQL.Types,
    resolvers: GraphQL.Resolvers,
    context: ({ req, res }: Context): Context => ({
      req,
      res,
      socket: socketServer,
      logger: signale
    })
  });
  graphqlServer.applyMiddleware({ app });

  return app;
};

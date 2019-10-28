import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http, { Server } from 'http';
import signale from 'signale';
import io, { Server as SocketServer } from 'socket.io';
import { ApolloServer } from 'apollo-server-express';

import requestLogger from './logger';
import getConnection from './db';
import defineAppRoutes from './router';
import Books from './schema.gql';

interface Context {
  req: Request;
  res: Response;
}

export default async (): Promise<Express> => {
  const app: Express = express();

  app.set('port', process.env.port || 5000);
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(requestLogger);

  await getConnection();

  // graphql
  const { typeDefs, resolvers } = Books;
  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }: Context): Context => ({ req, res })
  });
  graphqlServer.applyMiddleware({ app });

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

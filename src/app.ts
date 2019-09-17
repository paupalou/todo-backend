import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';

import getConnection from './db';
import UserController from './user/user.controller';

export default async (): Promise<Express> => {
  const app: Express = express();
  app.set('port', process.env.port || 3000);
  app.use(bodyParser.json());

  const db = await getConnection();

  app.get('/users', async (_, res: Response) => {
    const users = await UserController.getAllUsers(db);
    res.send(users);
  });

  app.post('/users', async (req: Request, res: Response) => {
    const createUserStatus = await UserController.createUser(db, req.body);
    res.sendStatus(createUserStatus);
  });

  return app;
};

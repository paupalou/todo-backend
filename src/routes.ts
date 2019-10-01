import { Express, Request, Response } from 'express';
import { Server as SocketServer } from 'socket.io';
import signale from 'signale';

import UserController from './user/user.controller';
import TodoController from './todo/todo.controller';
import HTTP from './httpStatus';
import Auth from './auth';

const TOKEN_MAPPING = '/token/validate';
const LOGIN_MAPPING = '/login';
const LOGOUT_MAPPING = '/logout';
const USERS_MAPPING = '/users';
const TODOS_MAPPING = '/todos';

// trick to make delay on calls
const sleep = (ms: number = Math.random() * 1500): Promise<any> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const defineAppRoutes = (app: Express, socketServer: SocketServer): void => {
  app.get(TOKEN_MAPPING, async (req: Request, res: Response) => {
    const token = Auth.getRequestToken(req);
    if (!token) {
      signale.warn('token not present');
      return res.sendStatus(HTTP.BAD_REQUEST);
    }

    const userId = await Auth.getUserIdFromToken(token);

    if (userId) {
      const { username, _id } = await UserController.getUserById(userId);
      await sleep();
      return res.send({ userId: _id, username });
    }

    res.sendStatus(HTTP.BAD_REQUEST);
  });

  app.post(LOGIN_MAPPING, async (req: Request, res: Response) => {
    const { username } = req.body;

    if (!username) {
      signale.error('username is mandatory param');
      res.sendStatus(HTTP.BAD_REQUEST);
      return;
    }

    const user = await UserController.getUser(username);
    if (user) {
      const token = await Auth.generateToken(user.id);
      signale.success(`token generated for [${username}]`);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: true
      });

      return res.send({ username, userId: user.id });
    }

    signale.error(`cannot login for user [${username}]`);
    res.sendStatus(HTTP.BAD_REQUEST);
  });

  app.get(LOGOUT_MAPPING, async (req: Request, res: Response) => {
    const token = Auth.getRequestToken(req);
    if (!token) {
      signale.warn('token not present');
      return res.sendStatus(HTTP.BAD_REQUEST);
    }

    const userId = await Auth.getUserIdFromToken(token);

    if (userId) {
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: true
      });

      return res.sendStatus(200);
    }

    res.sendStatus(HTTP.BAD_REQUEST);
  });

  app.get(USERS_MAPPING, async (_, res: Response) => {
    const users = await UserController.getAllUsers();
    res.send(users);
  });

  app.post(USERS_MAPPING, async (req: Request, res: Response) => {
    const userParams = req.body;
    const userCreated = await UserController.createUser(userParams);
    if (userCreated) {
      signale.success(`[${userParams.username}] created!`);
      res.sendStatus(HTTP.CREATED);
      return;
    }

    signale.error(`cannot create [${userParams.username}]`);
    res.sendStatus(HTTP.BAD_REQUEST);
  });

  app.get(TODOS_MAPPING, async (req: Request, res: Response) => {
    try {
      const token = Auth.getRequestToken(req);
      const userId = await Auth.getUserIdFromToken(token);
      const todos = await TodoController.getUserTodos(userId);
      res.send(todos);
    } catch (e) {
      signale.fatal(e);
      res.sendStatus(HTTP.BAD_REQUEST);
    }
  });

  app.post(TODOS_MAPPING, async (req: Request, res: Response) => {
    const todoParams = req.body;
    try {
      const token = Auth.getRequestToken(req);
      const userId = await Auth.getUserIdFromToken(token);
      const todoCreated = await TodoController.createTodo({
        ...todoParams,
        user: userId
      });
      if (todoCreated) {
        signale.success(`ToDo (${todoParams.title}) created!`);
        socketServer.to(userId).emit('TODO#CREATE', todoCreated);
        res.sendStatus(HTTP.CREATED);
        return;
      }

      signale.error(`cannot create ToDo (${todoParams.title})`);
      res.sendStatus(HTTP.BAD_REQUEST);
    } catch (e) {
      signale.fatal(e);
      res.sendStatus(HTTP.BAD_REQUEST);
    }
  });

  app.delete(
    `${TODOS_MAPPING}/:todoId`,
    async (req: Request, res: Response) => {
      const { todoId } = req.params;
      try {
        const token = Auth.getRequestToken(req);
        const userId = await Auth.getUserIdFromToken(token);
        const todoDeleted = await TodoController.deleteTodo({
          todoId,
          userId
        });
        if (todoDeleted) {
          signale.success(`todo (${todoId}) deleted!`);
          socketServer.to(userId).emit('TODO#DELETE', todoId);
          res.sendStatus(HTTP.DELETED);
          return;
        }

        signale.error(`cannot delete todo (${todoId})`);
        res.sendStatus(HTTP.BAD_REQUEST);
      } catch (e) {
        signale.fatal(e);
        res.sendStatus(HTTP.BAD_REQUEST);
      }
    }
  );
};

export default defineAppRoutes;

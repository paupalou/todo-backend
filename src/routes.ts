import { Express, Request, Response } from 'express';
import signale from 'signale';

import UserController from './user/user.controller';
import TodoController from './todo/todo.controller';
import HTTP from './httpStatus';
import Auth from './auth';

const LOGIN_MAPPING = '/login';
const USERS_MAPPING = '/users';
const TODOS_MAPPING = '/todos';

const defineAppRoutes = (app: Express): void => {
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
      const socketServer = app.get('socketServer');
      socketServer.emit('ACTION/LOGIN', { user: username });
      res.cookie('token', `Bearer ${token}`, {
        httpOnly: true,
        sameSite: true
      });
      return res.sendStatus(HTTP.OK);
    }

    signale.error(`cannot login for user [${username}]`);
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

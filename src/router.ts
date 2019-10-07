import { Express, Request, Response } from 'express';
import { Server as SocketServer } from 'socket.io';

import UserRoutes from './user/routes';
import UserControllerFactory from './user/controller';

import TodoRoutes from './todo/routes';
import TodoControllerFactory from './todo/controller';

type RouteType = (req: Request, res: Response) => Promise<any>;

// trick to make delay on calls
const sleep = (ms: number = Math.random() * 2500): Promise<any> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const defineAppRoutes = (app: Express, socketServer: SocketServer): void => {
  // Init required controllers
  const userController = UserControllerFactory();
  const todoController = TodoControllerFactory(socketServer);

  // User Routes Mappings
  app.get(UserRoutes.validateToken, userController.checkToken);
  app.post(UserRoutes.login, userController.login);
  app.get(UserRoutes.logout, userController.logout);
  app.get(UserRoutes.users, userController.getAllUsers);
  app.post(UserRoutes.users, userController.createUser);

  // Todos Routes Mappings
  app.get(TodoRoutes.getUserTodos, todoController.getUserTodos);
  app.post(TodoRoutes.createTodo, todoController.createTodo);
  app.put(TodoRoutes.toggleTodo, todoController.toggleTodo);
  app.delete(TodoRoutes.deleteTodo, todoController.deleteTodo);
};

export { RouteType, sleep };
export default defineAppRoutes;

import signale from 'signale';
import { Server as SocketServer } from 'socket.io';

import { RouteType } from './../router';
import TodoServiceFactory, { ITodoService as TodoService } from './service';
import HTTP from './../httpStatus';
import Auth from './../auth';

const getUserTodos = (todoService: TodoService): RouteType => async (
  req,
  res
) => {
  try {
    const token = Auth.getRequestToken(req);
    const userId = await Auth.getUserIdFromToken(token);
    const todos = await todoService.getUserTodos(userId);
    res.send(todos);
  } catch (e) {
    signale.fatal(e);
    res.sendStatus(HTTP.BAD_REQUEST);
  }
};

const createTodo = (todoService: TodoService): RouteType => async (
  req,
  res
) => {
  const todoParams = req.body;
  try {
    const token = Auth.getRequestToken(req);
    const userId = await Auth.getUserIdFromToken(token);
    const todoCreated = await todoService.createTodo({
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
};

const deleteTodo = (todoService: TodoService): RouteType => async (
  req,
  res
) => {
  const { todoId } = req.params;
  try {
    const token = Auth.getRequestToken(req);
    const userId = await Auth.getUserIdFromToken(token);
    const todoDeleted = await todoService.deleteTodo({
      todoId,
      userId
    });
    if (todoDeleted) {
      // socketServer.to(userId).emit('TODO#DELETE', todoId);
      res.sendStatus(HTTP.DELETED);
      return;
    }

    res.sendStatus(HTTP.BAD_REQUEST);
  } catch (e) {
    signale.fatal(e);
    res.sendStatus(HTTP.BAD_REQUEST);
  }
};

const TodoControllerFactory = (socket: SocketServer) => {
  const todoService = TodoServiceFactory(socket);

  return {
    getUserTodos: getUserTodos(todoService),
    createTodo: createTodo(todoService),
    deleteTodo: deleteTodo(todoService)
  };
};

export default TodoControllerFactory;

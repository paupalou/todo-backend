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
  } catch ({ message }) {
    signale.error(message);
    res.sendStatus(HTTP.NOT_FOUND);
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
      res.sendStatus(HTTP.CREATED);
      return;
    }

    signale.error(`cannot create ToDo (${todoParams.title})`);
    res.sendStatus(HTTP.NOT_FOUND);
  } catch (e) {
    signale.fatal(e);
    res.sendStatus(HTTP.NOT_FOUND);
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
      res.sendStatus(HTTP.DELETED);
      return;
    }

    res.sendStatus(HTTP.NOT_FOUND);
  } catch (e) {
    signale.fatal(e);
    res.sendStatus(HTTP.NOT_FOUND);
  }
};

const toggleTodo = (todoService: TodoService): RouteType => async (
  req,
  res
) => {
  const { todoId } = req.params;
  try {
    const token = Auth.getRequestToken(req);
    const userId = await Auth.getUserIdFromToken(token);
    const todoToggled = await todoService.toggleTodo({
      todoId,
      userId
    });
    if (todoToggled) {
      res.sendStatus(HTTP.NO_CONTENT);
      return;
    }

    res.sendStatus(HTTP.NOT_FOUND);
  } catch (e) {
    signale.fatal(e);
    res.sendStatus(HTTP.NOT_FOUND);
  }
};

const TodoControllerFactory = (socket: SocketServer) => {
  const todoService = TodoServiceFactory(socket);

  return {
    getUserTodos: getUserTodos(todoService),
    toggleTodo: toggleTodo(todoService),
    createTodo: createTodo(todoService),
    deleteTodo: deleteTodo(todoService)
  };
};

export default TodoControllerFactory;

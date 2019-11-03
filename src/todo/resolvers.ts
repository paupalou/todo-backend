import Auth from './../auth';
import TodoService from './service';
import { TodoParams as Todo } from './interface';
import { Resolver } from './../graphql/common';

const getUserTodos: Resolver = async (_, __, { req }): Promise<Todo[]> => {
  const userId = await Auth.getLoggedUser(req);
  const todos = await TodoService(undefined).getUserTodos(userId);
  return todos;
};

const createTodo: Resolver = async (
  _,
  { todoInput: { title, text } },
  { req, socket }
): Promise<boolean | Todo> => {
  const userId = await Auth.getLoggedUser(req);
  const todo = await TodoService(socket).createTodo({
    title,
    text,
    user: userId
  });

  return todo;
};

const deleteTodo: Resolver = async (
  _,
  { id: todoId },
  { req, socket }
): Promise<boolean> => {
  const userId = await Auth.getLoggedUser(req);
  const todoDeleted = await TodoService(socket).deleteTodo({
    todoId,
    userId
  });
  return todoDeleted;
};

export default {
  Query: {
    getUserTodos
  },
  Mutation: {
    createTodo,
    deleteTodo
  }
};

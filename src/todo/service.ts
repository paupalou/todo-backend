import signale from 'signale';
import { Server as SocketServer } from 'socket.io';

import Todo from './model';
import ITodo, { TodoParams } from './interface';

interface ITodoService {
  getUserTodos: Function;
  createTodo: Function;
  deleteTodo: Function;
  toggleTodo: Function;
}

interface UserTodoParams {
  todoId: string;
  userId: string;
}

const createTodo = (socket: SocketServer) => async (
  todoParams: TodoParams
): Promise<ITodo | boolean> => {
  try {
    const todo = await Todo.create(todoParams);
    signale.success(`ToDo (${todoParams.title}) created!`);
    socket.to(todo.user).emit('TODO#CREATE', todo);
    return todo;
  } catch (e) {
    console.error(e);
    return false;
  }
};

const deleteTodo = (socket: SocketServer) => async ({
  todoId,
  userId
}: UserTodoParams): Promise<boolean> => {
  try {
    const todo: ITodo = await Todo.findById(todoId);
    if (todo.user.toString() === userId) {
      await Todo.deleteOne(todo);
      socket.to(userId).emit('TODO#DELETE', todoId);
      signale.success(`todo ${todoId} deleted`);
      return true;
    }
    signale.warn(`user ${userId} does not belong todo ${todoId}`);
    return false;
  } catch (e) {
    return false;
  }
};

const getUserTodos = async (userId: string): Promise<Array<ITodo>> => {
  try {
    const userTodos = await Todo.find(
      { user: userId },
      'done title text created'
    );
    return userTodos;
  } catch (e) {
    /* handle error */
    return [];
  }
};

const toggleTodo = async ({
  todoId,
  userId
}: UserTodoParams): Promise<boolean> => {
  try {
    const todo: ITodo = await Todo.findById(todoId);
    if (todo.user.toString() === userId) {
      todo.done = !todo.done;
      await todo.save();
      signale.success(
        `todo ${todoId} toggled to ${todo.done ? 'done' : 'undone'}`
      );
      return true;
    }
    signale.warn(`user ${userId} does not belong todo ${todoId}`);
    return false;
  } catch (e) {
    return false;
  }
};

const TodoServiceFactory = (socket: SocketServer) => {
  return {
    getUserTodos,
    createTodo: createTodo(socket),
    deleteTodo: deleteTodo(socket),
    toggleTodo
  };
};

export { ITodoService };
export default TodoServiceFactory;

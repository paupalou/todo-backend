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
  todoParams: Partial<TodoParams>
): Promise<ITodo | boolean> => {
  try {
    const todo = await Todo.create(todoParams);
    signale.success(`ToDo (${todoParams.title}) created!`);
    socket.to(todo.user).emit('TODO#CREATE', todo);
    return todo;
  } catch (e) {
    return false;
  }
};

const deleteTodo = (socket: SocketServer) => async ({
  todoId,
  userId
}: UserTodoParams): Promise<boolean> => {
  try {
    const todo: ITodo = await Todo.findById(todoId);

    if (!todo) {
      signale.warn(`todo ${todoId} does not exists`);
      throw 'todo does not exists';
    }

    if (todo.user.toString() !== userId) {
      signale.warn(`user ${userId} does not belong todo ${todoId}`);
      throw 'Unauthorized';
    }

    await Todo.deleteOne(todo);
    socket.to(userId).emit('TODO#DELETE', todoId);
    signale.success(`todo ${todoId} deleted`);
    return true;
  } catch (e) {
    return false;
  }
};

const getUserTodos = async (userId: string): Promise<Array<ITodo>> => {
  if (!userId) {
    signale.fatal('userId required');
    throw Error('userId required');
  }

  const userTodos = await Todo.find(
    { user: userId },
    'done title text created'
  );
  return userTodos.sort((a, b) => {
    if (a.created > b.created) {
      return 1;
    }

    if (b.created > a.created) {
      return -1;
    }

    return 0;
  });
};

const toggleTodo = (socket: SocketServer) => async ({
  todoId,
  userId
}: UserTodoParams): Promise<boolean> => {
  try {
    const todo: ITodo = await Todo.findById(todoId);
    if (todo.user.toString() === userId) {
      todo.done = !todo.done;
      await todo.save();
      socket.to(userId).emit('TODO#TOGGLE', todo._id);
      signale.success(
        `todo ${todoId} toggled to ${todo.done ? 'done' : 'undone'}`
      );
      return true;
    }
    signale.warn(`user ${userId} does not belong todo ${todoId}`);
    return false;
  } catch (e) {
    signale.fatal(e);
    return false;
  }
};

const TodoServiceFactory = (socket: SocketServer) => {
  return {
    getUserTodos,
    createTodo: createTodo(socket),
    deleteTodo: deleteTodo(socket),
    toggleTodo: toggleTodo(socket)
  };
};

export { ITodoService };
export default TodoServiceFactory;

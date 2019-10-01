import signale from 'signale';

import Todo from './todo.model';
import ITodo, { TodoParams } from './todo.interface';

const createTodo = async (todoParams: TodoParams): Promise<ITodo | boolean> => {
  try {
    const todo = await Todo.create(todoParams);
    return todo;
  } catch (e) {
    console.error(e);
    return false;
  }
};

interface DeleteTodoParams {
  todoId: string;
  userId: string;
}

const deleteTodo = async ({
  todoId,
  userId
}: DeleteTodoParams): Promise<boolean> => {
  try {
    const todo: ITodo = await Todo.findById(todoId);
    console.log(`todo user: [${todo.user}] ${typeof todo.user}`);
    console.log(`expected user: [${userId}] ${typeof userId}`);
    if (todo.user.toString() === userId) {
      console.log('NO');
      await Todo.deleteOne(todo);
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
    const userTodos = await Todo.find({ user: userId });
    return userTodos;
  } catch (e) {
    /* handle error */
    return [];
  }
};

export default {
  getUserTodos,
  createTodo,
  deleteTodo
};

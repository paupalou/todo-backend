import mongoose from 'mongoose';
import ITodo, { TodoParams } from './../interface';

const listOfDummyTodos: Array<Partial<ITodo>> = [
  {
    _id: mongoose.Types.ObjectId().toString(),
    title: 'TODO',
    done: false,
    created: new Date()
  },
  {
    _id: mongoose.Types.ObjectId().toString(),
    title: 'TODO2',
    text: 'Lorem Ipsum',
    done: false,
    created: new Date()
  }
];

const mockedTodo: Partial<ITodo> = {
  _id: '5da99282bef2a1eee75f7caa',
  title: 'TODO',
  done: false,
  created: new Date(),
  user: '507f1f77bcf86cd799439011',
  save: (): Promise<any> => Promise.resolve(true)
};

export default {
  find: (_: TodoParams): Array<Partial<ITodo>> => {
    return listOfDummyTodos;
  },
  findById: (todoId: string): Partial<ITodo> => {
    if (todoId === '5da99282bef2a1eee75f7caa') {
      return mockedTodo;
    }
  },
  create: (params: TodoParams): Partial<ITodo> => ({
    ...mockedTodo,
    ...params
  })
};

import mongoose from 'mongoose';

import ToDoService from './service';

jest.mock('./model');

describe('ToDo Service', () => {
  const todoService = ToDoService(undefined);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getUserTodos', async () => {
    const userId = mongoose.Types.ObjectId();
    const serviceSpy = jest.spyOn(todoService, 'getUserTodos');
    const todos = await todoService.getUserTodos(userId.toString());
    const [first, second] = todos;

    expect(todos).toBeTruthy();
    expect(todos).toHaveLength(2);

    expect(first).toHaveProperty('title');
    expect(first.title).toEqual('TODO');

    expect(second).toHaveProperty('title');
    expect(second.title).toEqual('TODO2');
    expect(second).toHaveProperty('text');
    expect(second.text).toEqual('Lorem Ipsum');

    expect(serviceSpy).toHaveBeenCalled();
  });

  // test('toggleTodo', async () => {

  //   const conn = mongoose.createConnection();
  //   const TodoSchemaMocked = new mongoose.Schema(todoSchema);
  //   const TodoModelMocked = conn.model('UserMocked', UserSchemaMocked);
  //   const todo = await TodoModelMocked.toggleTodo();

  //   const userId = mongoose.Types.ObjectId();

  //   mockingoose(ToDo).toReturn(
  //     [
  //       {
  //         title: 'TEST_TODO'
  //       },
  //       {
  //         title: 'TEST_TODO2',
  //         text: 'Lorem Ipsum'
  //       }
  //     ],
  //     'find'
  //   );
  //   const todos = await ToDoService(undefined).getUserTodos(userId.toString());
  //   const [first, second] = todos;

  //   expect(todos).toBeTruthy();
  //   expect(todos).toHaveLength(2);

  //   expect(first).toHaveProperty('title');
  //   expect(first.title).toEqual('TEST_TODO');

  //   expect(second).toHaveProperty('title');
  //   expect(second.title).toEqual('TEST_TODO2');
  //   expect(second).toHaveProperty('text');
  //   expect(second.text).toEqual('Lorem Ipsum');
  // });
});

import mongoose from 'mongoose';
import mockingoose from 'mockingoose';

import ToDo from './model';
import ToDoService from './service';

describe('ToDo Service', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  test('getUserTodos', async () => {
    const userId = mongoose.Types.ObjectId();

    mockingoose(ToDo).toReturn(
      [
        {
          title: 'TEST_TODO'
        },
        {
          title: 'TEST_TODO2',
          text: 'Lorem Ipsum'
        }
      ],
      'find'
    );
    const todos = await ToDoService(undefined).getUserTodos(userId.toString());
    const [first, second] = todos;

    expect(todos).toBeTruthy();
    expect(todos).toHaveLength(2);

    expect(first).toHaveProperty('title');
    expect(first.title).toEqual('TEST_TODO');

    expect(second).toHaveProperty('title');
    expect(second.title).toEqual('TEST_TODO2');
    expect(second).toHaveProperty('text');
    expect(second.text).toEqual('Lorem Ipsum');
  });
});

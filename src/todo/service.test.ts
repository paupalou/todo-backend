import ToDoService from './service';

jest.mock('./model');

describe('ToDo Service', () => {
  const userId = '507f1f77bcf86cd799439011';

  const mockedTodo = {
    _id: '5da99282bef2a1eee75f7caa',
    title: 'TODO',
    done: false,
    created: new Date(),
    user: userId,
    save: (): Promise<any> => Promise.resolve(true)
  };

  const mockedSocket: any = jest.fn().mockImplementation(() => ({
    to: (_: any) => ({
      emit: (event: string, todo: string): void => {
        switch (event) {
          case 'TODO#CREATE':
            break;
          case 'TODO#TOGGLE': {
            if (todo === mockedTodo._id) {
              mockedTodo.done = !mockedTodo.done;
            }
            break;
          }
          default:
            return undefined;
        }
      }
    })
  }));

  const todoService = ToDoService(mockedSocket());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getUserTodos', async () => {
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

  test('toggleTodo', async () => {
    const serviceSpy = jest.spyOn(todoService, 'toggleTodo');
    const todoToggled = await todoService.toggleTodo({
      todoId: mockedTodo._id,
      userId
    });

    expect(todoToggled).toBeTruthy();
    expect(mockedTodo.done).toBeTruthy();
    expect(serviceSpy).toHaveBeenCalled();
  });

  test('createTodo', async () => {
    const serviceSpy = jest.spyOn(todoService, 'createTodo');
    const todoCreated = await todoService.createTodo({
      user: userId,
      title: mockedTodo.title,
      created: mockedTodo.created,
      done: mockedTodo.done
    });

    expect(todoCreated).toBeTruthy();

    if (typeof todoCreated === 'object') {
      const { save: saveFromReceived, ...todoReceived } = todoCreated;
      const { save: saveFromExpected, ...todoExpected } = mockedTodo;
      expect(todoReceived).toEqual(todoExpected);
    }

    expect(serviceSpy).toHaveBeenCalled();
  });
});

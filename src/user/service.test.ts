import mongoose from 'mongoose';

import UserService from './service';

jest.mock('./model');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getUserById', async () => {
    const userId = mongoose.Types.ObjectId().toString();
    const expectedUser = { _id: userId, username: 'TEST' };

    const serviceSpy = jest.spyOn(UserService, 'getUserById');
    const user = await UserService.getUserById(userId);

    expect(user).toBeTruthy();
    expect(user).toHaveProperty('username');
    expect(user.username).toEqual('TEST');
    expect(user).toMatchObject(expectedUser);
    expect(serviceSpy).toHaveBeenCalled();
  });

  test('getUser', async () => {
    const serviceSpy = jest.spyOn(UserService, 'getUser');
    const user = await UserService.getUser('TEST');

    expect(user).toBeTruthy();
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('username');
    expect(user.username).toEqual('TEST');
    expect(serviceSpy).toHaveBeenCalled();
  });

  test('getAllUsers return array of users', async () => {
    const serviceSpy = jest.spyOn(UserService, 'getAllUsers');
    const users = await UserService.getAllUsers();

    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(2);

    const [firstUser, secondUser] = users;
    expect(firstUser).toBeTruthy();
    expect(secondUser).toBeTruthy();

    expect(firstUser).toHaveProperty('username');
    expect(secondUser).toHaveProperty('username');

    expect(firstUser.username).toEqual('TEST');
    expect(secondUser.username).toEqual('TEST2');

    expect(serviceSpy).toHaveBeenCalled();
  });

  test('createUser', async () => {
    const userCreated = await UserService.createUser({ username: 'TEST' });
    expect(userCreated).toBeTruthy();
  });
});

import mongoose from 'mongoose';
import mockingoose from 'mockingoose';

import User, { userSchema } from './model';
import UserService from './service';

describe('User Service', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  test('getUserById', async () => {
    const userId = mongoose.Types.ObjectId();

    const expectedUser = {
      _id: userId,
      username: 'TEST'
    };

    mockingoose(User).toReturn(expectedUser, 'findOne');
    const user = await UserService.getUserById(undefined);

    expect(user).toBeTruthy();
    expect(user).toHaveProperty('username');
    expect(user.username).toEqual('TEST');
  });

  test('getUser', async () => {
    const userId = mongoose.Types.ObjectId();

    const expectedUser = {
      _id: userId,
      username: 'TEST'
    };

    mockingoose(User).toReturn(expectedUser, 'findOne');
    const user = await UserService.getUser('TEST');

    expect(user).toBeTruthy();
    expect(user).toHaveProperty('username');
    expect(user._id).toEqual(userId);
  });

  test('getAllUsers', async () => {
    const firstUserId = mongoose.Types.ObjectId();
    const secondUserId = mongoose.Types.ObjectId();

    const expectedUsers = [
      {
        _id: firstUserId,
        username: 'TEST'
      },
      {
        _id: secondUserId,
        username: 'TEST2'
      }
    ];

    mockingoose(User).toReturn(expectedUsers, 'find');
    const [firstUser, secondUser] = await UserService.getAllUsers();

    expect(firstUser).toBeTruthy();
    expect(secondUser).toBeTruthy();
    expect(firstUser).toHaveProperty('username');
    expect(secondUser).toHaveProperty('username');
    expect(firstUser._id).toEqual(firstUserId);
    expect(secondUser._id).toEqual(secondUserId);
  });

  test('createUser', async () => {
    const conn = mongoose.createConnection();
    const UserSchemaMocked = new mongoose.Schema(userSchema);
    const UserModelMocked = conn.model('UserMocked', UserSchemaMocked);
    const user = await UserModelMocked.create({ username: 'TEST' });

    expect(user).toBeInstanceOf(UserModelMocked);
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('created');
  });
});

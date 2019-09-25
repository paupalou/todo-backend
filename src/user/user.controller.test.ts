import { Types } from 'mongoose';
import mockingoose from 'mockingoose';

import UserController from './user.controller';
import UserModel from './user.model';
import getConnection from './../db';

describe('UserController', () => {
  const EXISTING_USER = 'Pau';
  const NON_EXISTING_USER = 'VoidUser';

  test('getUser should find existing user', async () => {
    const _id = Types.ObjectId();
    const fakeUser = {
      _id,
      username: EXISTING_USER,
      created: new Date()
    };

    mockingoose(UserModel).toReturn(fakeUser, 'findOne');

    const user = await UserController.getUser(EXISTING_USER);
    expect(user).toBeTruthy();
    expect(user).toMatchObject(fakeUser);
  });

  test('getUser should not find not existing user', async () => {
    mockingoose(UserModel).toReturn(undefined, 'findOne');

    const user = await UserController.getUser(NON_EXISTING_USER);
    expect(user).toBeFalsy();
  });

  test('getAllUsers should return user list', async () => {
    const firstUser = {
      _id: Types.ObjectId(),
      username: 'first',
      created: new Date()
    };

    const secondUser = {
      _id: Types.ObjectId(),
      username: 'second',
      created: new Date()
    };

    mockingoose(UserModel).toReturn([firstUser, secondUser], 'find');

    const users = await UserController.getAllUsers();
    expect(Array.isArray(users)).toBeTruthy();
    expect(users).toHaveLength(2);
    expect(users[0].username).toBe('first');
    expect(users[1].username).toBe('second');
  });

  test('getAllUsers should return empty list', async () => {
    mockingoose(UserModel).toReturn([], 'find');

    const users = await UserController.getAllUsers();
    expect(Array.isArray(users)).toBeTruthy();
    expect(users).toHaveLength(0);
  });

  test('createUser should work with correct params', async () => {
    const fakeUser = {
      // _id: Types.ObjectId(),
      username: EXISTING_USER
      // created: new Date()
    };

    // mockingoose(UserModel).reset();
    // await getConnection();

    // const userModel = new UserModel(fakeUser);

    mockingoose(UserModel).toReturn(fakeUser, 'save');
    // mockingoose(UserModel).toReturn({ username: 'merda' }, 'save');

    // const user = await UserModel.create({ username: NON_EXISTING_USER });
    const user = await UserController.createUser({
      username: NON_EXISTING_USER
    });
    // const user = await userModel.save()

    expect(user).toBeTruthy();
  });
});

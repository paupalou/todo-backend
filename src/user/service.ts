import { UserInputError } from 'apollo-server-express';
import signale from 'signale';

import User from './model';
import IUser, { UserParams } from './interface';

const getUserById = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  return user;
};

const getUser = async (username: string): Promise<IUser> => {
  const user = await User.findOne({ username });
  return user;
};

const getAllUsers = async (): Promise<Array<IUser>> => {
  const users = await User.find();
  return users;
};

const createUser = async (userParams: UserParams): Promise<IUser> => {
  signale.await('UserService.createUser');
  if (!userParams.username) {
    const errorMsg = 'username cannto be empty';
    signale.fatal(errorMsg);
    throw new UserInputError(errorMsg);
  }

  try {
    const user = await User.create(userParams);
    signale.success(`user ${userParams.username} created!`);
    return user;
  } catch (e) {
    const errorMsg = `user ${userParams.username} already taken`;
    signale.fatal(errorMsg);
    throw new UserInputError(errorMsg);
  }
};

export default {
  getUserById,
  getUser,
  getAllUsers,
  createUser
};

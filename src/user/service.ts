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

const createUser = async (userParams: UserParams): Promise<boolean> => {
  try {
    await User.create(userParams);
    return true;
  } catch (e) {
    signale.fatal(e);
    return false;
  }
};

export default {
  getUserById,
  getUser,
  getAllUsers,
  createUser
};

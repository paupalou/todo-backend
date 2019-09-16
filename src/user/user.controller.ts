import { Mongoose } from 'mongoose';

import UserFactory from './user.model';
import IUser from './user.interface';
import HTTP from '../httpStatus';

const getAllUsers = async (connection: Mongoose): Promise<Array<IUser>> => {
  const { model } = UserFactory(connection);
  const users = await model.find({});
  return users;
};

const createUser = async (connection: Mongoose, userAttributes: IUser): Promise<number> => {
  const { create } = UserFactory(connection);
  try {
    await create(userAttributes);
    return HTTP.CREATED;
  } catch (e) {
    return HTTP.BAD_REQUEST;
  }
};

export default {
  getAllUsers,
  createUser
};

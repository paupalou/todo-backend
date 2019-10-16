import mongoose from 'mongoose';
import IUser, { UserParams } from './../interface';

const dummyUser: Partial<IUser> = {
  _id: mongoose.Types.ObjectId().toString(),
  username: 'TEST'
};

const listOfDummyUsers: Array<Partial<IUser>> = [
  {
    _id: mongoose.Types.ObjectId().toString(),
    username: 'TEST'
  },
  {
    _id: mongoose.Types.ObjectId().toString(),
    username: 'TEST2'
  },
];

const getDummyUser = (userId: string) => ({ ...dummyUser, _id: userId });

export default {
  findById: (userId: string): Partial<IUser> | undefined => {
    const dummyUserWithId = getDummyUser(userId);
    if (userId === dummyUserWithId._id) {
      return dummyUserWithId;
    }

    return undefined;
  },
  findOne: ({ username }: UserParams): Partial<IUser> | undefined => {
    if (username === dummyUser.username) {
      return dummyUser;
    }

    return undefined;
  },
  find: (args: UserParams): Array<Partial<IUser>> => {
    if (!args || Object.keys(args).length === 0) {
      return listOfDummyUsers;
    }

    return [];
  },
  create: (_: UserParams): boolean => true
};

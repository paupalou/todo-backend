import Auth from './../auth';
import UserService from './service';
import { UserParams as User } from './interface';
import { Resolver } from './../graphql/common';

interface UserInfo {
  id: string;
  username: string;
  error?: string;
}

const login: Resolver = async (_, { username }, { res }): Promise<UserInfo> => {
  const user = await UserService.getUser(username);
  if (user) {
    const token = await Auth.generateToken(user.id);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: true
    });
    return {
      username,
      id: user._id
    };
  }
};

const logout: Resolver = async (_, __, { req, res }): Promise<boolean> => {
  try {
    await Auth.getLoggedUser(req);
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: true
    });
    return true;
  } catch (e) {
    return false;
  }
};

const tokenValidate: Resolver = async (
  _,
  __,
  { req, logger }
): Promise<UserInfo> => {
  logger.start('TokenValidate');
  const userId = await Auth.getLoggedUser(req);
  const { username } = await UserService.getUserById(userId);
  logger.success('TokenValidate');
  return { id: userId, username };
};

const registerUser: Resolver = async (
  _,
  { registerInput },
  { res }
): Promise<User> => {
  const user = await UserService.createUser({ ...registerInput });
  const token = await Auth.generateToken(user.id);

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: true
  });
  return user;
};

export default {
  Query: {
    users: (): Promise<User[]> => UserService.getAllUsers(),
    tokenValidate,
    login,
    logout
  },
  Mutation: {
    registerUser
  }
};

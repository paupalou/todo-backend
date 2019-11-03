import { AuthenticationError } from 'apollo-server-express';
import { Server as SocketServer } from 'socket.io';

import Auth from './auth';

import UserService from './user/service';
import { UserParams as User } from './user/interface';

import TodoService from './todo/service';
import { TodoParams as Todo } from './todo/interface';

interface LoginInfo {
  userId: string;
  username: string;
  error?: string;
}

const getResolvers = (socket: SocketServer) => ({
  Query: {
    users: (): Promise<User[]> => UserService.getAllUsers(),
    tokenValidate: async (
      _: any,
      __: any,
      context: any
    ): Promise<LoginInfo> => {
      try {
        const { req } = context;
        const token = Auth.getRequestToken(req);
        const userId = await Auth.getUserIdFromToken(token);
        if (userId) {
          const { username, _id } = await UserService.getUserById(userId);
          return { userId: _id, username };
        }
      } catch (e) {
        throw new AuthenticationError('token not present');
      }
    },
    login: async (_: any, args: any, context: any): Promise<LoginInfo> => {
      const { username } = args;
      const user = await UserService.getUser(username);
      if (user) {
        const token = await Auth.generateToken(user.id);
        context.res.cookie('token', token, {
          httpOnly: true,
          sameSite: true
        });
        return {
          username,
          userId: user.id
        };
      }
    },
    logout: async (_: any, __: any, context: any): Promise<boolean> => {
      const { req, res } = context;
      const token = Auth.getRequestToken(req);
      const userId = await Auth.getUserIdFromToken(token);
      if (userId) {
        res.clearCookie('token', {
          httpOnly: true,
          sameSite: true
        });
        return true;
      }

      return false;
    },
    getUserTodos: async (_: any, __: any, context: any): Promise<Todo[]> => {
      try {
        const { req } = context;
        const token = Auth.getRequestToken(req);
        const userId = await Auth.getUserIdFromToken(token);
        if (userId) {
          const todos = await TodoService(undefined).getUserTodos(userId);
          return todos;
        }
      } catch (e) {
        throw new AuthenticationError('unauthorized');
      }
    }
  },
  Mutation: {
    deleteTodo: async (
      _: any,
      { id: todoId }: any,
      context: any
    ): Promise<Partial<Todo>> => {
      try {
        const { req } = context;
        const token = Auth.getRequestToken(req);
        const userId = await Auth.getUserIdFromToken(token);
        if (userId) {
          await TodoService(socket).deleteTodo({
            todoId,
            userId
          });
          return { id: todoId };
        }
      } catch (e) {
        throw new AuthenticationError('unauthorized');
      }
    }
  }
});

export default {
  getResolvers
};

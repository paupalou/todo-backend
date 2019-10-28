import { gql } from 'apollo-server-express';

import Auth from './auth';

import UserService from './user/service';
import { UserParams as User } from './user/interface';

import TodoService from './todo/service';
import { TodoParams as Todo } from './todo/interface';

const typeDefs = gql`
  type User {
    _id: String
    username: String
    created: String
  }

  type Todo {
    _id: String
    title: String
    text: String
    created: String
    done: Boolean
  }

  type LoginInfo {
    userId: String!
    username: String
  }

  type Query {
    users: [User]
    login(username: String): LoginInfo
    tokenValidate: LoginInfo
    getUserTodos(id: String): [Todo]
  }
`;

interface LoginInfo {
  userId: string;
  username: string;
}

const resolvers = {
  Query: {
    users: (): Promise<User[]> => UserService.getAllUsers(),
    tokenValidate: async (
      _: any,
      __: any,
      context: any
    ): Promise<LoginInfo> => {
      const { req } = context;
      const token = Auth.getRequestToken(req);
      const userId = await Auth.getUserIdFromToken(token);
      if (userId) {
        const { username, _id } = await UserService.getUserById(userId);
        return { userId: _id, username };
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
    getUserTodos: async (_: any, args: any): Promise<Todo[]> => {
      const todos = await TodoService(undefined).getUserTodos(args.id);
      return todos;
    }
  }
};

export default {
  typeDefs,
  resolvers
};

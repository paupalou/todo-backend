import { gql } from 'apollo-server-express';

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

  type Query {
    users: [User]
    getUserTodos(id: String): [Todo]
  }
`;

const resolvers = {
  Query: {
    users: (): Promise<User[]> => UserService.getAllUsers(),
    getUserTodos: async (_: any, args: any): Promise<Todo[]> => {
      console.log(args.id);
      const todos = await TodoService(undefined).getUserTodos(args.id);
      console.log(todos);

      return todos;
    }
  }
};

export default {
  typeDefs,
  resolvers
};

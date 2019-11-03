import { gql } from 'apollo-server-express';

import userTypeDefs from './../user/typeDefs';
import todoTypeDefs from './../todo/typeDefs';

import userResolvers from './../user/resolvers';
import todoResolvers from './../todo/resolvers';

const Query = gql`
  type Query {
    _empty: String
  }
`;

const Mutation = gql`
  type Mutation {
    _empty: String
  }
`;

export default {
  Types: [Query, Mutation, ...userTypeDefs, ...todoTypeDefs],
  Resolvers: {
    Query: {
      ...userResolvers.Query,
      ...todoResolvers.Query
    },
    Mutation: {
      ...userResolvers.Mutation,
      ...todoResolvers.Mutation
    }
  }
};

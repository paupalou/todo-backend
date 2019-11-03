import { gql } from 'apollo-server-express';

const User = gql`
  type User {
    id: ID!
    username: String!
    created: String!
  }
`;

const LogInfo = gql`
  type LoginInfo {
    id: ID!
    username: String!
  }
`;

const Query = gql`
  extend type Query {
    users: [User!]!
    login(username: String): LoginInfo!
    logout: Boolean!
    tokenValidate: LoginInfo!
  }
`;

const Mutation = gql`
  input RegisterInput {
    username: String!
  }

  extend type Mutation {
    registerUser(registerInput: RegisterInput): User!
  }
`;

export default [Query, Mutation, User, LogInfo];

import { gql } from 'apollo-server-express';

const Todo = gql`
  type Todo {
    id: ID!
    title: String!
    text: String
    created: String!
    done: Boolean!
  }
`;

const Query = gql`
  extend type Query {
    getUserTodos: [Todo]
  }
`;

const Mutation = gql`
  input TodoInput {
    title: String!
    text: String
  }

  extend type Mutation {
    createTodo(todoInput: TodoInput): Todo
    deleteTodo(id: String): Boolean
  }
`;

export default [Query, Mutation, Todo];

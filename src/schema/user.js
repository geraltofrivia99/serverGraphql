import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
    ): RegisterResponse!
    signIn(login: String!, password: String!): LoginResponse!
    deleteUser(id: ID!): Boolean!
  }
  

  type LoginResponse {
    ok: Boolean!
    user: User
    token: String    
    refreshToken: String
    errors: [Error!]
  }
  type RegisterResponse {
    ok: Boolean!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    messages: [Message!]
    files: [File!]
    role: String
  }
`;
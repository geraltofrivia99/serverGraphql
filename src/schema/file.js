import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    file(id: ID!): File!
    files: [File!]!
  }
  extend type Mutation {
    createFile(url: String!, userId: Int!, type: String!): File!
    deleteFile(id: ID!): Boolean!
  }

  type File {
    id: ID!
    url: String!
    user: User!
    createdAt: String!
    type: String!
  }
`;
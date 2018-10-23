import { gql } from 'apollo-server-express';

export default gql`


  extend type Query {
    file(id: ID!): File!
    files: [File!]!
    userFiles: [File!]
    uploads: [Filenew]
  }
  
  extend type Mutation {
    createFile(url: String!, userId: Int!, type: String!, name: String!): File!
    deleteFile(id: ID!): Boolean!
    singleUpload(file: Upload!): File!
  }


  type File {
    id: ID!
    filename: String!
    url: String!
    user: User!
    createdAt: String!
    type: String!
  }

  type Filenew {
    filename: String!
    url: String!
  }
`;

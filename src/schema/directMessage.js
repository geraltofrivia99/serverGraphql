import { gql } from 'apollo-server-express';

export default gql`
  
  extend type Query {
    directMessages(otherUserId: Int!): [DirectMessage!]!
  }

  extend type Mutation {
    createDirectMessage(receiverId: Int!, text: String, file: Upload, ServerFile: SFile): Boolean!
  }
  extend type Subscription {
    newDirectMessage(userId: Int!): DirectMessage!
  }
  

  type DirectMessage {
    id: ID!
    text: String
    sender: User!
    receiverId: Int!
    createdAt: String!
    url: String
    filetype: String
    fileUT: FileUT
  }
  type FileUT {
    url: String
    type: String
  }
  input SFile {
    url: String
    type: String
  }
  `;
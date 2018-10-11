import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    directMessages(otherUserId: Int!): [DirectMessage!]!
  }

  extend type Mutation {
    createDirectMessage(reciverId: Int!, text: String!): Boolean!
  }

  type DirectMessage {
    id: ID!
    text: String!
    sender: String!
    reciverId: Int!
    createdAt: String!
  }
  `;
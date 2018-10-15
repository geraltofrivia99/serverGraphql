import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    directMessages(otherUserId: Int!): [DirectMessage!]!
  }

  extend type Mutation {
    createDirectMessage(receiverId: Int!, text: String!): Boolean!
  }
  extend type Subscription {
    newDirectMessage(userId: Int!): DirectMessage!
  }

  type DirectMessage {
    id: ID!
    text: String!
    sender: User!
    receiverId: Int!
    createdAt: String!
  }
  `;
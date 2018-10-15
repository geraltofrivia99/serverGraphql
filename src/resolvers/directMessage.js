// import { combineResolvers } from 'graphql-resolvers';
// import pubsub, { EVENTS } from '../subscription';
// import { isAuthenticated, isMessageOwner } from './auth';
import pubsub, { EVENTS } from '../subscription';
import { withFilter } from 'graphql-subscriptions';

export default {
  Subscription: {
    newDirectMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENTS.DIRECT.CREATED),
        (payload, args, {me}) => 
              (payload.senderId === me.id && payload.receiverId === args.userId) ||
              (payload.senderId === args.userId && payload.receiverId === me.id)
      ),
    },
  },
  Query: {
    directMessages: async (parent, { otherUserId }, { models, me }) =>
    models.DirectMessage.findAll(
      {
        order: [['createdAt', 'DESC']],
        where: {
          [models.sequelize.Op.or]: [
            {
              [models.sequelize.Op.and]: [{ receiverId: otherUserId }, { senderId: me.id }],
            },
            {
              [models.sequelize.Op.and]: [{ receiverId: me.id }, { senderId: otherUserId }],
            },
          ],
        },
      },
      { raw: true },
    ),
   
  },

  Mutation: {
    createDirectMessage: async (parent, args, { models, me }) => {
      try {
        const directMessage = await models.DirectMessage.create({
          ...args,
          senderId: me.id,
        });
        
        pubsub.publish(EVENTS.MESSAGE.CREATED, {
          senderId: me.id,
          receiverId: args.receiverId,
          newDirectMessage: {
            ...directMessage.dataValues,
            sender: {
              username: me.username,
            },
          },
        });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },

  DirectMessage: {
    sender: async ({sender, senderId }, args, { models }) => {
      console.log('SENDER', sender, senderId)
      if (sender) {
        return sender;
      }

      return models.User.findOne({ where: { id: senderId } }, { raw: true });
    },
  },
  // Subscription: {
  //   messageCreated: {
  //     subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
  //   },
  // },
};
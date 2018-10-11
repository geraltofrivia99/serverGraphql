// import { combineResolvers } from 'graphql-resolvers';
// import pubsub, { EVENTS } from '../subscription';
// import { isAuthenticated, isMessageOwner } from './auth';


export default {
  Query: {
    directMessages: async (parent, { otherUserId }, { models, me }) =>
    models.DirectMessage.findAll(
      {
        order: [['createdAt', 'DESC']],
        where: {
          [models.sequelize.Op.or]: [
            {
              [models.sequelize.Op.and]: [{ reciverId: otherUserId }, { senderId: me.id }],
            },
            {
              [models.sequelize.Op.and]: [{ reciverId: me.id }, { senderId: otherUserId }],
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
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },

  DirectMessage: {
    sender: async (parent, args, { models }) => {
      // if (user) return user;
      // return await models.User.findOne({where: { id: userId }}, { raw: true })
      console.log(parent)
      return "sdsadsa"
    },
  },
  // Subscription: {
  //   messageCreated: {
  //     subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
  //   },
  // },
};
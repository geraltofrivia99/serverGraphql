import { combineResolvers } from 'graphql-resolvers';
export default {
  Query: {
    file: async (parent, { id }, { models }) => {
      return await models.File.findById(id);
    },
    files: async (parent, args, { models }) => {
      return await models.File.findAll();
    },
    userFiles: async (parent, args, { models, me }) => {
      return await models.File.findAll({
        where: {userId: me.id}
      });
    },
  },
  Mutation: {
    createFile: async (parent, { url, userId, type, name }, { models }) => {
      return await models.File.create({
        url,
        userId,
        type,
        name
      });
    },
    deleteFile: combineResolvers(
      // isAuthenticated,
      // isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.File.destroy({ where: { id } });
      },
    ),
  },

  File: {
    user: async (file, args, { models }) => {
      console.log(file.userId)
      return await models.User.findById(file.userId);
    },
  },
};
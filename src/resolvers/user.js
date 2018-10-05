import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';

import { isAdmin } from './auth';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
    user: async (parent, { id }, { models, me }) => {
      console.log('tippppp', typeof id)
      return await models.User.findById(id);
    },
    me: async (parent, args, { models, me }) => {
      // console.log('parent', parent);
      // console.log('args', args)
      // console.log('models', models)
      // console.log('me', me)
      return await models.User.findById(me.id);
    },
  },
  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret },
    ) => {
      // const token = await createToken({ username, email, password }, secret, '30m')
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return {
        ok: true,
        user
      };
    },
    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login);
      if (!user) {
        // throw new UserInputError(
        //   'No user found with this login credentials.',
        // );
        return {
          ok: false,
          errors: [{
            path: 'loggin',
            message: 'No user found with this login credentials'
          }]
        }
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        // throw new AuthenticationError('Invalid password.');
        return {
          ok: false,
          errors: [{
            path: 'loggin',
            message: 'Invalid password'
          }]
        }
      }

      return { 
        token: createToken(user, secret, '30m'),
        user,
        ok: true, 
      };
    },
    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        return await models.User.destroy({
          where: { id },
        });
      },
    ),
  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
    },
    files: async (user, args, { models }) => {
      return await models.File.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};
import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';
import {createTokens} from '../../auth';
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
      { models, SECRET, SECRET2 },
    ) => 
    { 
      const user = await models.User.findByLogin(login);
      if (!user) {
        // user with provided email not found
        return {
          ok: false,
          errors: [{ path: 'email', message: 'Wrong email' }],
        };
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
    
      const refreshTokenSecret = user.password + SECRET2;
    
      const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);
      // console.log('TOKEN', token);
      // console.log('CREATETOKEN', createToken(user, SECRET, '24h'));
      return {
        ok: true,
        token,
        refreshToken,
        user
      };
      // const user = await models.User.findByLogin(login);
      // if (!user) {
      //   // throw new UserInputError(
      //   //   'No user found with this login credentials.',
      //   // );
      //   return {
      //     ok: false,
      //     errors: [{
      //       path: 'loggin',
      //       message: 'No user found with this login credentials'
      //     }]
      //   }
      // }

      // const isValid = await user.validatePassword(password);

      // if (!isValid) {
      //   // throw new AuthenticationError('Invalid password.');
      //   return {
      //     ok: false,
      //     errors: [{
      //       path: 'loggin',
      //       message: 'Invalid password'
      //     }]
      //   }
      // }

      // return { 
      //   token: createToken(user, SECRET, '24h'),
      //   user,
      //   ok: true, 
      // };
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
    friends: async (user, args, { models }) => {
      const { FriendId } = await models.Friends.findOne({});
      console.log(FriendId);
      return await models.Friends.findAll({
        where: {
          userId: user.id,
        },
      });
    },
    directMessageMembers: (_, args, { models, me }) =>
      models.sequelize.query(
        'select distinct on (u.id) u.id, u.username from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id) where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id)',
        {
          replacements: { currentUserId: me.id},
          model: models.User,
          raw: true,
        },
      ),
    files: async (user, args, { models }) => {
      return await models.File.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};
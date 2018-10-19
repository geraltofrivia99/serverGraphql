import cors from 'cors';

import express from 'express';
import { ApolloServer, AuthenticationError, } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import schema from './src/schema';
import resolvers from './src/resolvers';
import models, { sequelize } from './src/models';
import http from 'http';


const app = express();

app.use(cors('*'));

const getMe = async req => {
  const token = req.headers['authorization'];
  
  if (token) {
    try {
      // const d = await jwt.verify(token, 'wr3r23fwfwefwekwself.2456342.dawqdq');
      return await jwt.verify(token, 'wr3r23fwfwefwekwself.2456342.dawqdq');
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};
const getMeConnect = async connection => {
  const token = connection.context['token'];
  if (token) {
    try {
      // const d = await jwt.verify(token, 'wr3r23fwfwefwekwself.2456342.dawqdq');
      return await jwt.verify(token, 'wr3r23fwfwefwekwself.2456342.dawqdq');
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

app.use('/files', express.static('files'));

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      const me = await getMeConnect(connection);
      return {
        models,
        me,
        secret: 'wr3r23fwfwefwekwself.2456342.dawqdq'
      };
    }
    if (req) {
      const me = await getMe(req);
      
        return {
          me,
          models,
          secret: 'wr3r23fwfwefwekwself.2456342.dawqdq'
    };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(new Date());
    
  }

  httpServer.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});



const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
      files: [
        {
          url: 'dsadas/dsadsae/ewqwe/ewqeqw',
          createdAt: date.setSeconds(date.getSeconds() + 1),
          type: 'Doc',
          filename: 'new File'
        },
      ],
    },
    {
      include: [models.Message, models.File],
    },
  );

  await models.User.create(
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: 'Published a complete ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
      files: [
        {
          url: 'dsadas/dsadsae/ewqwe',
          createdAt: date.setSeconds(date.getSeconds() + 1),
          type: 'Doc',
          filename: 'filic'
        },
        {
          url: 'dsadas/dsadsae/gdfgdf',
          createdAt: date.setSeconds(date.getSeconds() + 1),
          type: 'Doc',
          filename: 'hahha'
        },
        {
          url: 'dsadas/dsadsae/eqeqwwqwe',
          createdAt: date.setSeconds(date.getSeconds() + 1),
          type: 'Doc',
          filename: '4toto'
        },
      ]
    },
    {
      include: [models.Message, models.File],
    },
  );
  await models.User.create(
    {
      username: 'nikita',
      email: 'nikita@robin.com',
      password: 'nikita99',
      role: 'ADMIN',
      messages: [
        {
          text: 'privet vsem',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
      files: [
        {
          url: 'dsadas/dsadsae/ewqwe/ewqeqw',
          createdAt: date.setSeconds(date.getSeconds() + 1),
          type: 'Doc',
          filename: 'new File'
        },
      ],
    },
    {
      include: [models.Message, models.File],
    },
  );
};

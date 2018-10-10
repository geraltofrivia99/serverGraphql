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
  const token = req.headers['x-token'];
  if (token) {
    try {
      // const d = await jwt.verify(token, 'wr3r23fwfwefwekwself.2456342.dawqdq');
      // console.log(d)
      return await jwt.verify(token, 'wr3r23fwfwefwekwself.2456342.dawqdq');
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

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
      return {
        models,
      };
    }
    if (req) {
      const me = await getMe(req);
        return {
          models,
          me,
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
          name: 'new File'
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
          name: 'filic'
        },
        {
          url: 'dsadas/dsadsae/gdfgdf',
          createdAt: date.setSeconds(date.getSeconds() + 1),
          type: 'Doc',
          name: 'hahha'
        },
        {
          url: 'dsadas/dsadsae/eqeqwwqwe',
          createdAt: date.setSeconds(date.getSeconds() + 1),
          type: 'Doc',
          name: '4toto'
        },
      ]
    },
    {
      include: [models.Message, models.File],
    },
  );
};

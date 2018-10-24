import cors from 'cors';
import express from 'express';
import { ApolloServer, AuthenticationError, } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import schema from './src/schema';
import resolvers from './src/resolvers';
import models, { sequelize } from './src/models';
import http from 'http';

const SECRET = 'wr3r23fwfwefwekwself.2456342.dawqdq';
const SECRET2 = 'wr3r23fwfwefwekwself.2456342.dawqdq.43242341321rds';
const app = express();

app.use(cors('*'));

const getMe = async (req) => {
  const token = req.headers['authorization'];
  if (token) {
    try {
      return await jwt.verify(token, SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};
const getMeConnect = async (connection) => {
  const token = connection.context['token'];
  if (token) {
    try {
      // const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
      // if (newTokens.token && newTokens.refreshToken) {
        // res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        // res.set('x-token', 'HELLO eto x-token');
        // res.set('x-refresh-token', newTokens.refreshToken);
      // }
      // const d = await jwt.verify(token, 'wr3r23fwfwefwekwself.2456342.dawqdq');
      return await jwt.verify(token, SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

app.use('/files', express.static('files'));
// app.use('/files/messages', express.static('files/messages'));
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
        SECRET,
        SECRET2
      };
    }
    if (req) {
      const me = await getMe(req);
      console.log(me);
        return {
          me,
          models,
          SECRET,
          SECRET2
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
          url: 'http://localhost:8000/files/hello.txt',
          createdAt: date.setSeconds(date.getSeconds() + 1),
          type: 'text/plain',
          filename: 'hello.txt'
        },
        // {
        //   url: 'dsadas/dsadsae/gdfgdf',
        //   createdAt: date.setSeconds(date.getSeconds() + 1),
        //   type: 'Doc',
        //   filename: 'hahha'
        // },
        // {
        //   url: 'dsadas/dsadsae/eqeqwwqwe',
        //   createdAt: date.setSeconds(date.getSeconds() + 1),
        //   type: 'Doc',
        //   filename: '4toto'
        // },
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

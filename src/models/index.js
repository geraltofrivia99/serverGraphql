import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  'trash', 'postgres', 'postgres',
  {
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
  },
);

const models = {
  User: sequelize.import('./user'),
  Message: sequelize.import('./message'),
  File: sequelize.import('./files'),
  DirectMessage: sequelize.import('./directMessage'),
  Member: sequelize.import('./member'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export { sequelize };

export default models;
const file = (sequelize, DataTypes) => {
  const Files = sequelize.define('file', {
    url: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Not doesnt exist',
        },
      },
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Not doesnt exist',
        },
      },
    },
    size: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Not doesnt exist',
        },
      },
    },
    filename: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Not doesnt exist',
        },
      },
    },
  });

  Files.associate = models => {
    Files.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return Files;
};

export default file;
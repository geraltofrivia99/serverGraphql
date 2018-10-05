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
    }
  });

  Files.associate = models => {
    Files.belongsTo(models.User);
  };

  return Files;
};

export default file;
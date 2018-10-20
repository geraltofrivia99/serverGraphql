const directMessage = (sequelize, DataTypes) => {
  const DirectMessage = sequelize.define('direct_message', {
    text: DataTypes.STRING,
    url: DataTypes.STRING,
    filetype: DataTypes.STRING,
  });

  DirectMessage.associate = models => {
    DirectMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'receiverId',
        field: 'receiver_id'
      }
    });
    DirectMessage.belongsTo(models.User, {
      foreignKey: {
        name: 'senderId',
        field: 'sender_id'
      }
    });
  };
  
   


  return DirectMessage;
};

export default directMessage;
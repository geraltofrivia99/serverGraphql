const friends = (sequelize, DataTypes) => {
  const Friends = sequelize.define('friends', {
    accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
  }
  });
  
  return Friends;
};

export default friends;
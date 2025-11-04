const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id_user: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "User_username_key"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "User_email_key"
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_diet: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'User',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "User_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "User_pkey",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "User_username_key",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
};

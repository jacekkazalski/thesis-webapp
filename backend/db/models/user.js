const {Sequelize, DataTypes} = require('sequelize');
const sequelize =  require('../../config/database')

const User = sequelize.define(
    'User',
    {
      id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_diet: {
        type: DataTypes.INTEGER,
      }
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
    );

module.exports = User;
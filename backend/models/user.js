const {Sequelize, DataTypes} = require('sequelize');
const sequelize =  require('../config/database');
const Recipe = require('./recipe');

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
        unique: {
          msg: 'Username already exists',
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email already exists',
        },
        validate: {
          isEmail: {
            msg: 'Invalid email',
          },
        },
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
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

User.hasMany(Recipe, {foreignKey: 'added_by'});
Recipe.belongsTo(User, {foreignKey: 'added_by'});

module.exports = User;
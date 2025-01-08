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
        validate: {
          len: {
            args: [8, 255],
            msg: 'Password must be at least 8 characters long',
          }
        }
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
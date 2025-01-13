const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Ingredient = sequelize.define(
  'Ingredient',
  {
    id_ingredient: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'This ingredient already exists'
      }
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Ingredient;
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Favourite = sequelize.define(
  'Favourite',
  {
    id_user: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id_user'
      },
    },
    id_recipe: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Recipe',
        key: 'id_recipe'
    }},
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Favourite;
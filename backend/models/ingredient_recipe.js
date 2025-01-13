const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Ingredient_recipe = sequelize.define(
  'Ingredient_recipe',
  {
    id_ingredient: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Ingredient',
        key: 'id_ingredient'
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
    quantity: {
      type: DataTypes.STRING
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Ingredient_recipe;
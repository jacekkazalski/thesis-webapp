const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const Ingredient_recipe = require('./ingredient_recipe');

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

Ingredient.hasMany(Ingredient_recipe, {foreignKey: 'id_ingredient'});
Ingredient_recipe.belongsTo(Ingredient, {foreignKey: 'id_ingredient'});

module.exports = Ingredient;
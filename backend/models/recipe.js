const {DataTypes} = require('sequelize');
const sequelize =  require('../config/database');
const Recipe = sequelize.define(
  'Recipe',
  {
    id_recipe: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    instructions: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_path: {
      type: DataTypes.STRING
    },
    added_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id_user'
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Recipe;
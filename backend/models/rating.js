'use strict';
const {DataTypes} = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Rating.init({
    id_user: {
      type:DataTypes.INTEGER,
       primaryKey:true
      },

    id_recipe: {
      type:DataTypes.INTEGER,
      primaryKey:true
    },
    value: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};
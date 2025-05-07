const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ingredient_recipe', {
    id_ingredient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Ingredient',
        key: 'id_ingredient'
      }
    },
    id_recipe: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Recipe',
        key: 'id_recipe'
      }
    },
    quantity: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'Ingredient_recipe',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Ingredient_recipe_pkey",
        unique: true,
        fields: [
          { name: "id_ingredient" },
          { name: "id_recipe" },
        ]
      },
    ]
  });
};

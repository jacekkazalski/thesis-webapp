const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ingredient_diet', {
    id_ingredient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_diet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    }
  }, {
    tableName: 'Ingredient_diet',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Ingredient_diet_pk",
        unique: true,
        fields: [
          { name: "id_ingredient" },
          { name: "id_diet" },
        ]
      },
    ]
  });
};

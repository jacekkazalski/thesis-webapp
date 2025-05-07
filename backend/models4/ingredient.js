const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ingredient', {
    id_ingredient: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "Ingredient_name_key"
    }
  }, {
    tableName: 'Ingredient',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Ingredient_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "Ingredient_pkey",
        unique: true,
        fields: [
          { name: "id_ingredient" },
        ]
      },
    ]
  });
};

const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Ingredient_category",
    {
      id_ingredient: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Ingredient_category",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "Ingredient_category_pk",
          unique: true,
          fields: [{ name: "id_ingredient" }, { name: "id_category" }],
        },
      ],
    },
  );
};

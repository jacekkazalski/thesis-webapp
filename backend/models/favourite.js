const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Favourite",
    {
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "User",
          key: "id_user",
        },
      },
      id_recipe: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Recipe",
          key: "id_recipe",
        },
      },
    },
    {
      tableName: "Favourite",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "Favourite_pkey",
          unique: true,
          fields: [{ name: "id_user" }, { name: "id_recipe" }],
        },
      ],
    },
  );
};

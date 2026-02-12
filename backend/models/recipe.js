const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Recipe",
    {
      id_recipe: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image_path: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      added_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id_user",
        },
      },
    },
    {
      tableName: "Recipe",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "Recipe_pkey",
          unique: true,
          fields: [{ name: "id_recipe" }],
        },
      ],
    },
  );
};

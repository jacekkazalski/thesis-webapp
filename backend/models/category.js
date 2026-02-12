const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Category",
    {
      id_category: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      tableName: "Category",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "Category_pk",
          unique: true,
          fields: [{ name: "id_category" }],
        },
      ],
    },
  );
};

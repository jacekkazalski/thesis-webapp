const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Rating', {
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id_user'
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
    value: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'Rating',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Rating_pkey",
        unique: true,
        fields: [
          { name: "id_user" },
          { name: "id_recipe" },
        ]
      },
    ]
  });
};

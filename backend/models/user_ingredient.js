const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User_ingredient', {
    id_ingredient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Ingredient',
        key: 'id_ingredient'
      }
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id_user'
      }
    },
    is_excluded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'User_ingredient',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "ingredient_user_pkey",
        unique: true,
        fields: [
          { name: "id_ingredient" },
          { name: "id_user" },
        ]
      },
    ]
  });
};

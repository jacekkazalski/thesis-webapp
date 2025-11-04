const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Diet', {
    id_diet: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Diet',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Diet_pk",
        unique: true,
        fields: [
          { name: "id_diet" },
        ]
      },
    ]
  });
};

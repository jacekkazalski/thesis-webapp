'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Favourite', {
      id_user: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.INTEGER,
            references: {
              model: 'User',
              key: 'id_user'
            },
          },
          id_recipe: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.INTEGER,
            references: {
              model: 'Recipe',
              key: 'id_recipe'
          }},
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Favourite');
  }
};
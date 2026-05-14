'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('medias',
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true
        },
        nom: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        type: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        url: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
      });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('medias');

  }
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('etablissements', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      nom: { type: Sequelize.STRING, allowNull: false },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      telephone: {
        type: Sequelize.STRING,
        unique: true
      },
      statut: {
        type: Sequelize.ENUM('inactif', 'actif'),
        allowNull: false,
        defaultValue: 'actif'
      },
      id_media: {
        type: Sequelize.BIGINT,
        references: {
          model: 'medias',
          key: 'id'
        },
        onDelete: 'SET NULL'
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

  async down(queryInterface) {
    await queryInterface.dropTable('etablissements');
  }
};


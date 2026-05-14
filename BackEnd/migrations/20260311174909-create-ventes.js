'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ventes', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      montant: {
        type: Sequelize.DECIMAL(10, 2),
      },
      reduction: {
        type: Sequelize.DECIMAL(10, 2),
      },
      id_etablissement: {
        type: Sequelize.BIGINT,
        references: {
          model: 'etablissements',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      id_client: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'clients',
          key: 'id'
        },
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('ventes');
  }
};


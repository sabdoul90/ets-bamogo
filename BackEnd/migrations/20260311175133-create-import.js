'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('imports',
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true
        },
        titre: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        type: {
          type: Sequelize.ENUM(
            'produits',
          ),
          defaultValue: 'produits',
        },
        statut: {
          type: Sequelize.ENUM('a faire', 'echec', 'en cours', 'termine'),
          defaultValue: 'a faire',
        },
        id_media: {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: 'medias',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        id_etablissement: {
          type: Sequelize.BIGINT,
          references: {
            model: 'etablissements',
            key: 'id'
          },
          onDelete: 'SET NULL'
        },
        journal: {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: 'medias',
            key: 'id'
          },
          onUpdate: 'CASCADE',
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('imports');
  }
};

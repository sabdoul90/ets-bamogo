'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('utilisateurs', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      nom: { type: Sequelize.STRING, allowNull: false },
      prenom: { type: Sequelize.STRING, allowNull: false },
      telephone: {
        type: Sequelize.STRING,
        unique: true
      },
      token: {
        type: Sequelize.STRING(255),
        unique: true
      },
      mot_de_passe: {
        type: Sequelize.STRING(255),
      },
      id_role: {
        type: Sequelize.BIGINT,
        references: {
          model: 'roles',
          key: 'id'
        },
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
    await queryInterface.dropTable('utilisateurs');
  }
};
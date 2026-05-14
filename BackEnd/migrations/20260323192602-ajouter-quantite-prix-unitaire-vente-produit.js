'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {


    await queryInterface.addColumn('vente_produits', 'cout_unitaire', {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
      after: 'quantite'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('vente_produits', 'cout_unitaire');
  }
};

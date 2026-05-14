'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {


    await queryInterface.addColumn('produits', 'quantite_stock', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      after: 'prix_unitaire'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('produits', 'quantite_stock');
  }
};

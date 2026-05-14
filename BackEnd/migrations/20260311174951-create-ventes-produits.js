'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('vente_produits', { 
      id:{ 
        type: Sequelize.BIGINT, 
        autoIncrement: true, 
        primaryKey: true 
      },
      quantite:{ 
        type: Sequelize.INTEGER,
        allowNull:true
      },
      id_vente :{
        type: Sequelize.BIGINT,
        references: { model: 'ventes', key: 'id' },
        onDelete: 'SET NULL'
      },
      id_produit :{
        type: Sequelize.BIGINT,
        references: { model: 'produits', key: 'id' },
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull:false,
        type: Sequelize.DATE,
        defaultValue : Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
    
  },

  async down (queryInterface, Sequelize) {
   
    await queryInterface.dropTable('vente_produits');
     
  }
};


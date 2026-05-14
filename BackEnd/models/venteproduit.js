module.exports = (sequelize, DataTypes) => {

  const VenteProduit = sequelize.define("VenteProduit", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    quantite: {
      type: DataTypes.INTEGER
    },

    cout_unitaire: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }

  }, {
    tableName: "vente_produits"
  });

  VenteProduit.associate = (models) => {

    VenteProduit.belongsTo(models.Vente, {
      foreignKey: "id_vente",
      as : "vente"
    });

    VenteProduit.belongsTo(models.Produit, {
      foreignKey: "id_produit",
      as : "produit"
    });

  };

  return VenteProduit;

};
module.exports = (sequelize, DataTypes) => {

  const Produit = sequelize.define("Produit", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },

    prix_unitaire: {
      type: DataTypes.DECIMAL(10,2)
    },

    quantite_stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }

  }, {
    tableName: "produits"
  });

  Produit.associate = (models) => {

    Produit.belongsTo(models.Etablissement, {
      foreignKey: "id_etablissement",
      as : "etablissement"
    });

    Produit.hasMany(models.VenteProduit, {
      foreignKey: "id_produit",
      as : "vendus"
    });

  };

  return Produit;

};
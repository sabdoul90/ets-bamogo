module.exports = (sequelize, DataTypes) => {

  const Vente = sequelize.define("Vente", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    montant: {
      type: DataTypes.DECIMAL(10,2)
    },

    reduction: {
      type: DataTypes.DECIMAL(10,2)
    }

  }, {
    tableName: "ventes"
  });

  Vente.associate = (models) => {

    Vente.belongsTo(models.Etablissement, {
      foreignKey: "id_etablissement",
      as : "etablissement"
    });

    Vente.belongsTo(models.Client, {
      foreignKey: "id_client",
      as : "client"
    });

    Vente.belongsTo(models.Media, {
      foreignKey: "id_media",
      as : "media"
    });

    Vente.hasMany(models.VenteProduit, {
      foreignKey: "id_vente",
      as : "vendus"
    });

  };

  return Vente;

};
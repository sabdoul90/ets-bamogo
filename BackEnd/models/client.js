module.exports = (sequelize, DataTypes) => {

  const Client = sequelize.define("Client", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    nom_prenom: {
      type: DataTypes.STRING,
      allowNull: false
    },

    telephone: {
      type: DataTypes.STRING,
      unique: true
    }

  }, {
    tableName: "clients"
  });

  Client.associate = (models) => {

    Client.belongsTo(models.Etablissement, {
      foreignKey: "id_etablissement",
      as : "etablissement"
    });

    Client.hasMany(models.Vente, {
      foreignKey: "id_client",
      as : "ventes"
    });

  };

  return Client;

};
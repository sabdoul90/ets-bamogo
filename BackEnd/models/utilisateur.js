module.exports = (sequelize, DataTypes) => {

  const Utilisateur = sequelize.define("Utilisateur", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },

    prenom: {
      type: DataTypes.STRING,
      allowNull: false
    },

    telephone: {
      type: DataTypes.STRING,
      unique: true
    },

    token: {
      type: DataTypes.STRING
    },

    mot_de_passe: {
      type: DataTypes.STRING
    }

  }, {
    tableName: "utilisateurs"
  });

  Utilisateur.associate = (models) => {

    Utilisateur.belongsTo(models.Role, {
      foreignKey: "id_role",
      as : "role"
    });

    Utilisateur.belongsTo(models.Etablissement, {
      foreignKey: "id_etablissement",
      as : "etablissement"
    });

  };

  return Utilisateur;

};
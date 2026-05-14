module.exports = (sequelize, DataTypes) => {

    const Etablissement = sequelize.define("Etablissement", {

        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },

        nom: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(255),
            unique: true
        },

        telephone: {
            type: DataTypes.STRING,
            unique: true
        },

        statut: {
            type: DataTypes.ENUM("inactif", "actif")
        }

    }, {
        tableName: "etablissements"
    });

    Etablissement.associate = (models) => {

        Etablissement.belongsTo(models.Media, {
            foreignKey: "id_media",
            as : "media"
        });

        Etablissement.hasMany(models.Utilisateur, {
            foreignKey: "id_etablissement",
            as : "travailleurs"
        });

        Etablissement.hasMany(models.Client, {
            foreignKey: "id_etablissement",
            as : "clients"
        });

        Etablissement.hasMany(models.Produit, {
            foreignKey: "id_etablissement",
            as : "produits"
        });

        Etablissement.hasMany(models.Vente, {
            foreignKey: "id_etablissement",
            as : "ventes"
        });

    };

    return Etablissement;

};
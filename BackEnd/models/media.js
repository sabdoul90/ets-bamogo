module.exports = (sequelize, DataTypes) => {

  const Media = sequelize.define("Media", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false
    },

    url: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {
    tableName: "medias"
  });

  Media.associate = (models) => {

    Media.hasOne(models.Etablissement, {
      foreignKey: "id_media",
      as : "etablissement"
    });

    Media.hasOne(models.Vente, {
      foreignKey: "id_media",
      as : "vente"
    });

    Media.hasOne(models.Import,{
        foreignKey : "id_media",
        as : "import"
    });

    Media.hasOne(models.Import,{
        foreignKey : "journal",
        as : "import journal"
    })

  };

  return Media;

};
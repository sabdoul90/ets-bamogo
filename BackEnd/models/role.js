module.exports = (sequelize, DataTypes) => {

  const Role = sequelize.define("Role", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    titre: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {
    tableName: "roles"
  });

  Role.associate = (models) => {

    Role.hasMany(models.Utilisateur, {
      foreignKey: "id_role",
      as : "utilisateurs"
    });

  };

  return Role;

};
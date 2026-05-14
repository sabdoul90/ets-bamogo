module.exports = (sequelize, Datatypes) => {

    const Import = sequelize.define('Import',
        {
            id: {
                type: Datatypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            titre: {
                type: Datatypes.STRING(100),
                allowNull: false
            },
            type: {
                type: Datatypes.ENUM(
                    'produits',
                ),
                defaultValue: 'produits',
            },
            statut: {
                type: Datatypes.ENUM('a faire', 'echec', 'en cours', 'termine'),
                defaultValue: 'a faire',
            },
            id_media: {
                type: Datatypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'medias',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            id_etablissement: {
                type: Datatypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'medias',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            journal: {
                type: Datatypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'medias',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            }
        }, {
        tableName: 'imports',
        freezeTableName: true,
        timestamps: true
    });

    Import.associate = function (models) {
        Import.belongsTo(models.Media, { foreignKey: 'id_media', as: 'media' });
        Import.belongsTo(models.Media, { foreignKey: 'journal', as: 'fichier journal' });
        Import.belongsTo(models.Etablissement, { foreignKey: 'id_etablissement', as: 'etablissement' });
    };
    return Import;
}
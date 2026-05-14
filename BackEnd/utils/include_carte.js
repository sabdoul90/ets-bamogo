
module.exports = {

    utilisateur: (models) => ({
        role: {
            model: models.Role,
            as: 'role',
        },
        etablissement: {
            model: models.Etablissement,
            as: 'etablissement'
        }
    }),

    role: (models) => ({
        utilisateurs: {
            model: models.Utilisateur,
            as: 'utilisateurs'
        }
    }),


    etablissement: (models) => ({
        media: {
            model: models.Media,
            as: 'media'
        },
        utilisateurs: {
            model: models.Utilisateur,
            as: 'travailleurs'
        },
        clients: {
            model: models.Client,
            as: 'clients'
        },
        produits: {
            model: models.Produit,
            as: 'produits'
        },
        ventes: {
            model: models.Vente,
            as: 'ventes'
        }
    }),

    import: (models) => ({
        etablissement: {
            model: models.Etablissement,
            as: 'etablissement'
        },
        journal: {
            model: models.Media,
            as: 'fichier journal'
        },
        media: {
            model: models.Media,
            as: 'media'
        }
    }),

    media: (models) => ({
        etablissement: {
            model: models.Etablissement,
            as: 'etablissement'
        },
        vente: {
            model: models.Vente,
            as: 'vente'
        },
        import: {
            model: models.Import,
            as: 'import'
        },
        journal: {
            model: models.Import,
            as: 'import journal'
        }
    }),

    produit: (models) => ({
        etablissement: {
            model: models.Etablissement,
            as: 'etablissement'
        },
        vendus: {
            model: models.VenteProduit,
            include: [
                {
                    model: models.Vente,
                    as: "vente"
                }
            ],
            as: 'vendus'
        }
    }),
    venteproduit: (models) => ({
        produit: {
            model: models.Produit,
            as: 'produit'
        },
        vente: {
            model: models.Vente,
            as: 'vente'
        }
    }),

    vente: (models) => ({
        etablissement: {
            model: models.Etablissement,
            as: 'etablissement'
        },
        client: {
            model: models.Client,
            as: 'client'
        },
        media: {
            model: models.Media,
            as: 'media'
        },
        produits: {
            model: models.VenteProduit,
            include: [
                {
                    model: models.Produit,
                    as: 'produit'
                },
            ],
            as: 'vendus'
        },
    }),

    client: (models) => ({
        etablissement: {
            model: models.Etablissement,
            as: 'etablissement'
        },
        vente: {
            model: models.Vente,
            as: 'ventes'
        }
    })
};

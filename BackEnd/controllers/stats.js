const db = require('../models');
const { Produit,Vente,Client } = require('../models');
const { Op } = require('sequelize');



module.exports = {

    async getstat  (req, res) {
        try {
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);


            const totalVente = await Vente.sum('montant', {
                where: {
                    createdAt: {
                        [Op.gte]: startOfDay,
                        [Op.lt]: endOfDay
                    }
                }
            });

            const totalProduit = await Produit.sum('quantite_stock');

            const totalClient = await Client.count();

            res.status(200).json({
                data: [
                    { nom: 'Ventes', valeur: totalVente || 0 },
                    { nom: 'Produits', valeur: totalProduit || 0 },
                    { nom: 'Clients', valeur: totalClient || 0 }
                ]
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ data: { message: 'Erreur lors de la récupération des statistiques' } });
        }
    }
};

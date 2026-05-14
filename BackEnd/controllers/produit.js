const { Produit } = require('../models');
const manajer = require('../utils/request_manajer');
const carte = require('../utils/include_carte');
const db = require('../models');

module.exports = {

    async getProduits(req, res) {
        try {

            const { page, limit, include } = req.query;

            const options = manajer(
                { page, limit },
                carte.produit(db),
                include
            );

            const { rows, count } = await Produit.findAndCountAll(options);

            return res.status(200).json({
                data: rows,
                pagination: {
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 10,
                    total: count,
                    pages: Math.ceil(count / (limit || 10))
                }
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    },

    async createProduit(req, res) {
        try {

            const produit = await Produit.create(req.body);

            return res.status(201).json({
                message: "Ajout effectué avec succès",
                data: produit 
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    },

    async updateProduit(req, res) {
        try {

            await Produit.update(req.body, {
                where: { id: req.params.id }
            });

            return res.status(200).json({
                data: { message: "Produit modifié" }
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    },

    async getProduitById(req, res) {
        try {

            const { include } = req.query;

            const options = manajer(
                {},
                carte.produit(db),
                include
            );

            const produit = await Produit.findByPk(req.params.id, options);

            if (!produit) {
                return res.status(404).json({
                    data: { message: "Produit introuvable" }
                });
            }

            return res.status(200).json({
                data: produit
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    },

    async deleteProduit(req, res) {
        try {

            await Produit.destroy({
                where: { id: req.params.id }
            });

            return res.status(200).json({
                data: { message: "Produit supprimé" }
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    }

};
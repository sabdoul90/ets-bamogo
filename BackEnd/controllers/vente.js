const { Vente } = require('../models');
const manajer = require('../utils/request_manajer');
const carte = require('../utils/include_carte');
const db = require('../models');

module.exports = {

    async getVentes(req, res) {
        try {

            console.log("Utilisateur qui accede à la liste des ventes : ", req.utilisateur);

            const { page, limit, include } = req.query;

            const options = manajer(
                { page, limit },
                carte.vente(db),
                include
            );

            console.log(options)

            const { rows, count } = await Vente.findAndCountAll(options);

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

    async updateVente(req, res) {

        try {

            await Vente.update(
                req.body,
                {
                    where: { id: req.params.id }
                }
            );

            return res.status(200).json({
                data: {
                    message: "Vente modifiée"
                }
            });

        } catch (error) {

            return res.status(500).json({
                data: {
                    message: error.message
                }
            });

        }

    },

    async createVente(req, res) {
        try {

            const vente = await Vente.create(req.body);

            return res.status(201).json({
                message: "Ajout effectué avec succès",
                data: vente
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    },

    async getVenteById(req, res) {
        try {

            const { include } = req.query;

            console.log("Include:", include);

            const options = manajer(
                {},
                carte.vente(db),
                include
            );

            console.log("Options pour la vente :", options);

            const vente = await Vente.findByPk(req.params.id, options);

            if (!vente) {
                return res.status(404).json({
                    data: { message: "Vente introuvable" }
                });
            }

            return res.status(200).json({
                data: vente
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    },

    async deleteVente(req, res) {
        try {

            await Vente.destroy({
                where: { id: req.params.id }
            });

            return res.status(200).json({
                data: { message: "Vente supprimée" }
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    }

};
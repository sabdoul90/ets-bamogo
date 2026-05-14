const { VenteProduit } = require('../models');
const manajer = require('../utils/request_manajer');
const carte = require('../utils/include_carte');
const db = require('../models');

module.exports = {

    async getVenteProduits(req, res) {
        try {

            const { page, limit, include } = req.query;

            const options = manajer(
                { page, limit },
                carte.venteproduit(db),
                include
            );

            const { rows, count } = await VenteProduit.findAndCountAll(options);

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

    async createVenteProduit(req, res) {
        try {

            const venteproduit = await VenteProduit.create(req.body);

            return res.status(201).json({
                message: "Ajout effectué avec succès",
                data: venteproduit 
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    },

    async updateVenteProduit(req, res) {
        try {

            await VenteProduit.update(req.body, {
                where: { id: req.params.id }
            });

            return res.status(200).json({
                data: { message: "Modification effectuée" }
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    },

    async getVenteProduit(req, res) {
        try {

            const { include } = req.query;

            const options = manajer(
                {},
                carte.venteproduit(db),
                include
            );

            const venteproduit = await VenteProduit.findByPk(req.params.id, options);

            if (!venteproduit) {
                return res.status(404).json({
                    data: { message: "Introuvable" }
                });
            }

            return res.status(200).json({
                data: venteproduit
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    },

    async deleteVenteProduit(req, res) {
        try {

            await VenteProduit.destroy({
                where: { id: req.params.id }
            });

            return res.status(200).json({
                data: { message: "Suppression effectuée" }
            });

        } catch (error) {

            return res.status(500).json({
                data: { message: error.message }
            });

        }
    }

};
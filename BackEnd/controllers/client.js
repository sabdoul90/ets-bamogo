const { Client } = require('../models');
const manajer = require('../utils/request_manajer');
const carte = require('../utils/include_carte');
const db = require('../models');

module.exports = {

    async getClients(req, res) {
        try {

            const { page, limit, include } = req.query;

            const options = manajer(
                { page, limit },
                carte.client(db),
                include
            );

            const { rows, count } = await Client.findAndCountAll(options);

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
                data: {
                    message: error.message
                }
            });

        }
    },

    async createClient(req, res) {

        try {

            const client = await Client.create(req.body);

            return res.status(201).json({
                message: "Ajout effectué avec succès",
                data: client
                
            });

        } catch (error) {

            return res.status(500).json({
                data: {
                    erreur: error.message,
                    message: "Echec de l'ajout"
                }
            });

        }

    },

    async updateClient(req, res) {

        try {

            await Client.update(
                req.body,
                { where: { id: req.params.id } }
            );

            return res.status(200).json({
                data: {
                    message: "Client modifié"
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

    async getClientById(req, res) {

        try {

            const { include } = req.query;

            const options = manajer(
                {},
                carte.client(db),
                include
            );

            const client = await Client.findByPk(
                req.params.id,
                options
            );

            if (!client) {

                return res.status(404).json({
                    data: {
                        message: "Client introuvable"
                    }
                });

            }

            return res.status(200).json({
                data: client
            });

        } catch (error) {

            return res.status(500).json({
                data: {
                    message: error.message
                }
            });

        }

    },

    async deleteClient(req, res) {

        try {

            await Client.destroy({
                where: { id: req.params.id }
            });

            return res.status(200).json({
                data: {
                    message: "Client supprimé"
                }
            });

        } catch (error) {

            return res.status(500).json({
                data: {
                    message: error.message
                }
            });

        }

    }

};